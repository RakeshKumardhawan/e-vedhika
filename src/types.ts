export interface DeploymentLog {
  id: string;
  computerName: string;
  userName: string;
  windowsVersion: string;
  toolVersion: string;
  status: 'SUCCESS' | 'FAILED' | 'WARNING';
  nicDigiSigner: string;
  dotNet35: string;
  internetZone: string;
  localIntranet: string;
  trustedSites: string;
  ieMode: string;
  hyp2003: string;
  wdProxkey: string;
  errorMessage: string;
  createdAt: any;
}
