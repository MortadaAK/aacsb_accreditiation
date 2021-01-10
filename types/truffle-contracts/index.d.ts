/* Generated by ts-generator ver. 0.0.8 */
/* tslint:disable */

import { ApplicationContract } from "./Application";
import { CertificateContract } from "./Certificate";
import { FacultyContract } from "./Faculty";
import { InboxContract } from "./Inbox";
import { InstitutionContract } from "./Institution";
import { MigrationsContract } from "./Migrations";

declare global {
  namespace Truffle {
    interface Artifacts {
      require(name: "Application"): ApplicationContract;
      require(name: "Certificate"): CertificateContract;
      require(name: "Faculty"): FacultyContract;
      require(name: "Inbox"): InboxContract;
      require(name: "Institution"): InstitutionContract;
      require(name: "Migrations"): MigrationsContract;
    }
  }
}

export { ApplicationContract, ApplicationInstance } from "./Application";
export { CertificateContract, CertificateInstance } from "./Certificate";
export { FacultyContract, FacultyInstance } from "./Faculty";
export { InboxContract, InboxInstance } from "./Inbox";
export { InstitutionContract, InstitutionInstance } from "./Institution";
export { MigrationsContract, MigrationsInstance } from "./Migrations";
