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

interface ResultProps {
  data:
    | UseProps[]
    | { room: string; volume: number }[]
    | { label: string | undefined; value: number }[];
  total_volume: number;
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

  let result = {
    total_volume: 0,
  } as ResultProps;

  switch (type) {
    case "global": {
      if (date_mode == "single") {
        result.data = data;

        data.forEach((item) => {
          result.total_volume += item.volume;
        });
      } else {
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
            case "week":
              key = tempDate.format("WW-DD");
              tempDate.add(1, "day");
              break;
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
            case "week":
              key = item_date.format("WW-DD");
              break;
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
          result.total_volume += item.volume;
          aggregationMap[key] += item.volume;
        });

        // Formatter les labels
        result.data = Object.entries(aggregationMap).map(([label, value]) => {
          const formattedLabel = () => {
            switch (date_mode) {
              case "week":
                return moment(label, "WW-DD").format("DDDD");
                break;
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
      }

      break;
    }
    case "room": {
      // 1. Tableau des différentes pièces (sans doublons)
      const uniqueRooms = [
        ...new Set(sensors.map((item: SensorProps) => item.room)),
      ];

      // 2. Déclaration des clés de toutes les pièces
      uniqueRooms.forEach((room: string) => {
        aggregationMap[room] = 0;
      });

      // 3. Ajouter volume à chaque clé
      data.forEach((item, index) => {
        let key = sensors.filter((item2) => item2.id == item.id)[0].room;

        result.total_volume += item.volume;
        aggregationMap[key] += item.volume;
      });

      // 4. Traitement des champs
      result.data = Object.entries(aggregationMap)
        .map(([label, value]) => ({ label, value }))
        .sort((a, b) => b.value - a.value); // tri décroissant par volume

      break;
    }
    case "device": {
      data.forEach((item, index) => {
        let key = item.id;
        if (!aggregationMap[key]) {
          aggregationMap[key] = 0;
        }

        result.total_volume += item.volume;
        aggregationMap[key] += item.volume;
      });

      result.data = Object.entries(aggregationMap)
        .map(([id, value]) => {
          const sensor_index = sensors.findIndex(
            (item) => item.id.toString() == id
          );

          console.log(sensor_index);

          let label = "";

          if (sensor_index !== undefined) {
            label = sensors[sensor_index].name;
          }

          return {
            label,
            value,
          };
        })
        .sort((a, b) => b.value - a.value);
      break;
    }
    default:
      break;
  }

  return result;
};

export default getChartData;
