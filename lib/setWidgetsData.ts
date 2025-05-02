interface WidgetProps {
  name?: string;
  room?: string;
  id?: number;
  key?: string;
  size: number;
  type?: string;
  config?: {
    mode?: string;
  };
}

const setWidgetsData = (arr: WidgetProps[]) => {
  let next_arr = JSON.parse(JSON.stringify(arr));
  const null_elem = { size: 0 };
  arr.map((item) => {
    const index = next_arr.findIndex(
      (item2: WidgetProps) => item2.type == item.type
    );
    // console.log(item);
    // console.log(index);
    if (item.size == 2) {
      next_arr.splice(index + 1, 0, null_elem);
      console.log(1);
    } else if (item.size == 1) {
      //   console.log(index);
      //   console.log(index % 2);
      if (index % 2 == 0) {
        // console.log("left");
        // Élément sur la gauche
        if (index !== next_arr.length - 1 && next_arr[index + 1].size == 2) {
          // Si pas d'élément de size 1 à sa droite pour compléter la ligne
          next_arr.splice(index + 1, 0, null_elem);
          console.log(2);
        }
      } else {
        // Élément sur la droite
        // next_arr.splice(index, 0, null_elem);
        // console.log(3);
      }
    }
  });

  return next_arr;
};

export default setWidgetsData;
