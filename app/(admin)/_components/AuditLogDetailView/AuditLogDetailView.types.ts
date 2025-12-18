export interface AuditLog {
  id: string;
  action: string;
  entityType: string;
  entityId?: string | null;
  metadata?: any;
  ipAddress?: string | null;
  createdAt: string;
  performedBy: {
    id: string;
    name: string | null;
    email: string;
  };
  user?: {
    id: string;
    name: string | null;
    email: string;
  } | null;
}

export interface AuditLogDetailViewProps {
  auditLog: AuditLog;
  onClose?: () => void;
}
