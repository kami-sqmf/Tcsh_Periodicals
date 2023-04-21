import { IconType } from "react-icons";
import { WebMapIndex } from "./webmap";

interface WebApp extends WebMapIndex<"Child"> {
  nav: {
    icon: IconType;
    iconHover: IconType;
  };
}

interface Breadcrumb {
  title: string;
  href: string;
  icon: IconType;
}