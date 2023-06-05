import { DrawerActionType } from "@react-navigation/native";

export type Navigation = {
  dispatch(arg0: DrawerActionType): unknown;
  navigate: (scene: string) => void;
  toggleDrawer: (action: void) => void;
  navigation : void ;

};
