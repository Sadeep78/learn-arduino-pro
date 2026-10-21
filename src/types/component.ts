export interface ComponentCatalogItem {
  id: string;
  name: string;
  category: 'Microcontroller' | 'Output' | 'Input' | 'Passive' | 'Actuator' | 'Display' | 'Sensor';
  shortDesc: string;
  fullDesc: string;
  pinCount: number;
  voltageRating: string;
  currentRating: string;
  pinout: { pin: string; name: string; desc: string; type: string }[];
  datasheetSummary: {
    operatingVoltage: string;
    maxCurrent: string;
    interfaceType: string;
    operatingTemp: string;
    dimensions: string;
  };
  typicalApplications: string[];
  circuitTips: string[];
  sampleCode: string;
  simulatorType?: string;
  iconName: string;
}
