export interface config {
    Asset_Name: string,
    Asset_Type: string,
    // Use_Type:string , 
    Industrial_Type: string,
    Industrial_Data_source: string,
    Connection_Type: string,
    Tracking_Device_Type: string,
    Sensor_Type: string,
    Sub_Category_Sensor_Type: string,
    Sensor_Data_Type: string,
    MAC_Address: string
}
export interface __addAssetDevice{
    PID :number,
    ASSET_CONFIG_ID:number,
    DEVICE_ID:any,
    VALUE:any,
    UNITS:any,
    STATUS:any,
    LATITUDE:any,
    LONGITUDE:any,
    LOCATION:any,
    LAST_UPDATE_TIME:any
}
export const _protocolType=['HTTP','HTTPS','MQTT']

export const _widgetSIZE = [{ name: 'Full width', file: 'col-md-12', isSelected: false },
{ name: 'Md width', file: 'col-md-7', isSelected: false },
{ name: 'Sm width', file: 'col-md-5', isSelected: false },
{ name: 'Min width', file: 'col-md-4', isSelected: false },
];
export const _widgetTYPE = [{ name: 'CHARTS', file: 'chart-widget', isSelected: false },
{ name: 'MAPS', file: 'map-widget', isSelected: false },
{ name: 'Highlights', file: 'highlight-widget', isSelected: false },
{ name: 'TABLE', file: 'table-widget', isSelected: false },
// { name: 'Utility', file: 'guage-widget', isSelected: false },
{ name: 'ON/OFF Controls', file: 'onoff-widget', isSelected: false },
{ name: 'Activity Controls', file: 'activity-widget', isSelected: false },
{ name: 'Summary', file: 'summary-widget', isSelected: false },
{ name: 'Reports', file: 'reports-widget', isSelected: false },
];

export const _chartTYPE = [{ name: 'Bar', file: 'bar-chart', isSelected: false },
{ name: 'Line', file: 'line-chart', isSelected: false },
{ name: 'Donut', file: 'donut-chart', isSelected: false },
{ name: 'Pie', file: 'pie-chart', isSelected: false },
{ name: 'scatter', file: 'scatter-chart', isSelected: false },
{ name: 'gauge', file: 'guage-widget', isSelected: false },
];

export const _assetTypes = ['Security',
    'Activity Trackers',
    'Industrial Security and Safety',
    ' Augmented Reality',
    'Motion Detection'
];
export const _deviceType = ["IMEI", "MAC ADDRESS","DEVICE ID"];
export interface __deviceHistory{
    PID:number;
    ASSET_CONFIG_ID:number;
     DEVICE_ID:any;
    VALUE:any;
    STATUS:any;
    LATITUDE:any;
    LONGITUDE:any;
    LOCATION:string;
}