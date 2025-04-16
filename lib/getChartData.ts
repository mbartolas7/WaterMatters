import { DateType } from "react-native-ui-datepicker";

import firestore, {
  FirebaseFirestoreTypes,
} from "@react-native-firebase/firestore";
import moment from "moment";

const usesCollection = firestore().collection("uses");

interface GetChartDataProps {
  type: string;
  start_date: DateType;
  end_date: DateType;
  date_mode: string;
  sensors: SensorProps[];
}

interface UseProps {
  begin_tp: FirebaseFirestoreTypes.Timestamp | Date;
  end_tp: Date;
  duration: number;
  id: number;
  running: boolean;
  volume: number;
  key: string;
}

interface SensorProps {
  name: string;
  room: string;
  id: number;
  key: string;
}

const getChartData = async ({
  type,
  start_date,
  end_date,
  date_mode,
  sensors,
}: GetChartDataProps) => {
  let data = [] as UseProps[];

  await usesCollection
    .where("begin_tp", ">=", start_date)
    .where("begin_tp", "<=", end_date)
    .orderBy("begin_tp", "desc")
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((documentSnapshot) => {
        let doc_data = documentSnapshot.data() as Omit<UseProps, "key">;
        const { begin_tp, end_tp } = doc_data;
        doc_data.begin_tp = new Date(
          begin_tp.seconds * 1000 + begin_tp.nanoseconds / 1_000_000
        );
        doc_data.end_tp = new Date(
          end_tp.seconds * 1000 + end_tp.nanoseconds / 1_000_000
        );

        data.push({ ...doc_data, key: documentSnapshot.id });
      });

      console.log(data);
    });

  let aggregationMap: Record<string, number> = {};

  let total = 0;

  let results;

  switch (type) {
    case "global": {
      if (date_mode == "single") return data;

      const start = moment(start_date).startOf(
        date_mode == "month" ? "isoWeek" : "month"
      );
      const end = moment(end_date).endOf(
        date_mode == "month" ? "isoWeek" : "month"
      );
      const tempDate = start.clone();

      while (tempDate.isSameOrBefore(end)) {
        let key = "";
        switch (date_mode) {
          case "month":
            key = tempDate.format("YYYY-[S]WW");
            tempDate.add(1, "week");
            break;
          case "year":
            key = tempDate.format("YYYY-MM");
            tempDate.add(1, "month");
            break;
          default:
            key = tempDate.format("YYYY-MM-DD");
            tempDate.add(1, "day");
            break;
        }
        aggregationMap[key] = 0;
      }

      data.forEach((item) => {
        const item_date = moment(item.begin_tp);
        let key = "";

        switch (date_mode) {
          case "month":
            key = item_date.format("YYYY-[S]WW"); // Année ISO + numéro de semaine ISO
            break;
          case "year":
            key = item_date.format("YYYY-MM");
            break;
          default:
            key = item_date.format("YYYY-MM-DD");
        }

        if (!aggregationMap[key]) {
          aggregationMap[key] = 0;
        }
        aggregationMap[key] += item.volume;
      });

      // Formatter les labels
      results = Object.entries(aggregationMap).map(([label, value]) => {
        const formattedLabel = () => {
          switch (date_mode) {
            case "month":
              return moment(label, "YYYY-[S]WW").format("[S]WW");
              break;
            case "year":
              return moment(label, "YYYY-MM").format("MMM")[0].toUpperCase();
              break;
            default:
              break;
          }
        };

        return {
          label: formattedLabel(), // Affichage avec un format plus court
          value,
        };
      });

      break;
    }
    case "room": {
      const uniqueRooms = [
        ...new Set(sensors.map((item: SensorProps) => item.room)),
      ];
      // 1. Déclaration des clés de toutes les pièces
      uniqueRooms.forEach((room: string) => {
        aggregationMap[room] = 0;
      });

      data.forEach((item, index) => {
        let key = sensors.filter((item2) => item2.id == item.id)[0].room;

        total += item.volume;
        aggregationMap[key] += item.volume;
      });

      console.log(aggregationMap);

      results = Object.entries(aggregationMap);
      break;
    }
    default:
      break;
  }

  return results;
};

export default getChartData;
