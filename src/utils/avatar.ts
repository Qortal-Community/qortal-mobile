import { getBaseApiReact } from "../App";

export const getUserAvatarUrl = (name?: string | null) => {
  if (!name) return "";
  return `${getBaseApiReact()}/arbitrary/THUMBNAIL/${name}/qortal_avatar?async=true`;
};

export const getGroupAvatarUrl = (
  groupId?: string | number | null,
  ownerName?: string | null
) => {
  if (!groupId && groupId !== 0) return "";
  if (!ownerName) return "";
  return `${getBaseApiReact()}/arbitrary/THUMBNAIL/${ownerName}/qortal_group_avatar_${groupId}?async=true`;
};
