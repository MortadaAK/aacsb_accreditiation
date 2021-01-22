enum CertificateStatus {
  requested,
  approved,
  rejected,
}
export const display = (type: any): string => {
  return (
    // @ts-ignore
    {
      [CertificateStatus.requested]: "Requested",
      [CertificateStatus.approved]: "Approved",
      [CertificateStatus.rejected]: "Rejected",
    }[type.toString()] || "Not Found"
  );
};
export default CertificateStatus;
