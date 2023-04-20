import { merge } from "lodash"
import Button from "./Button"
import CardHeader from "./CardHeader"
import Container from "./Container"
import DialogContent from "./DialogContent"
import Link from "./Link"
import ListItemButton from "./ListItemButton"
import Menu from "./Menu"
import Tab from "./Tab"
import TextField from "./TextField"
import Typography from "./Typography"

export default function ComponentsOverrides(theme) {
  return merge(Button(theme), Typography(theme), Link(theme), CardHeader(theme), Menu(theme), TextField(), Tab(theme), ListItemButton(theme), DialogContent(theme), Container(theme))
}
