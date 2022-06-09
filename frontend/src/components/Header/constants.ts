import authController from "../../controllers/AuthController";
import { IContextMenuProps } from "../ContextMenu/types";

export const profileActions: IContextMenuProps = {
    header: "Профиль",
    isVisible: false,
    options: [
        {
            name: "Редактировать",
            onClick: (_) => {}
        },
        {
            name: "Выйти",
            onClick: (_) => {authController.logout()}
        }
    ]
}
