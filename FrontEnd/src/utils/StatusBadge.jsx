import { Badge } from "react-bootstrap";

export const StatusBadge = ({ map, status }) => {
  const info = map[status] || { label: status, variant: "secondary" };
  return <Badge bg={info.variant}>{info.label}</Badge>;
};
