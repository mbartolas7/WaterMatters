import { DateType } from "react-native-ui-datepicker";

import firestore from "@react-native-firebase/firestore";
import moment from "moment";

const usesCollection = firestore().collection("uses");

interface GetChartDataProps {
  type: string;
  start_date: DateType;
  end_date: DateType;
  date_mode: string;
}

interface UseProps {
  begin_tp: Date;
  end_tp: Date;
  duration: number;
  id: number;
  running: boolean;
  volume: number;
  key: string;
}

const getChartData = async ({
  type,
  start_date,
  end_date,
  date_mode,
}: GetChartDataProps) => {
  let data = [] as UseProps[];
  await usesCollection
    .where("begin_tp", ">=", start_date)
    .where("begin_tp", "<=", end_date)
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((documentSnapshot) => {
        data.push({ ...documentSnapshot.data(), key: documentSnapshot.id });
      });

      console.log(data);
    });

  const aggregationMap: Record<string, number> = {};

  if (date_mode == "single") return data;

  //   console.log(start_date);
  //   console.log(end_date);

  const start = moment(start_date).startOf(
    date_mode == "month" ? "isoWeek" : "month"
  );
  const end = moment(end_date).endOf(
    date_mode == "month" ? "isoWeek" : "month"
  );
  //   const start = moment(start_date).startOf("isoWeek");
  //   const end = moment(end_date).endOf("isoWeek");
  const tempDate = start.clone();

  //   console.log(start.format("[S]WW"));
  //   console.log(end.format("[S]WW"));

  while (tempDate.isSameOrBefore(end)) {
    // console.log(moment(tempDate).format("DD MM YY"));
    // console.log(tempDate.format("YYYY-[S]WW"));
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

  //   console.log(aggregationMap);

  data.forEach((item) => {
    // console.log(moment(item.begin_tp).format("DD MM YY"));
    const item_date = moment(item.begin_tp);
    let key = "";

    switch (date_mode) {
      case "month":
        // console.log(item_date.format("DD MM YY"));
        // console.log(item_date.format("YYYY-[S]WW"));
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

  //   console.log(aggregationMap);

  // Optionnel : transformer en tableau trié
  const result = Object.entries(aggregationMap).map(([label, value]) => {
    const formattedLabel = () => {
      switch (date_mode) {
        case "month":
          return moment(label, "YYYY-[S]WW").format("[S]WW");
          break;
        case "year":
          return moment(label, "YYYY-MM").format("MMM")[0].toUpperCase();
        default:
          break;
      }
    };

    return {
      label: formattedLabel(), // Affichage avec un format plus court
      value,
    };
  });

  return result;
};

export default getChartData;
