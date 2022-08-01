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
export interface __addAssetDevice {
    PID: number,
    ASSET_CONFIG_ID: number,
    DEVICE_ID: any,
    VALUE: any,
    UNITS: any,
    STATUS: any,
    LATITUDE: any,
    LONGITUDE: any,
    LOCATION: any,
    LAST_UPDATE_TIME: any
}
export const _protocolType = ['HTTP', 'HTTPS', 'MQTT']
export const _dateFilters = [
    { key: 'Last 5 min', state: 'minutes', step: 5 }, {
        key: 'Last 15 min', state: 'minutes', step: 15
    }, { key: 'Last 30 min', state: 'minutes', step: 30 }, {
        key: 'Last 1 hr', state: 'hours', step: 1
    }, { key: 'Last 3 hrs', state: 'hours', step: 3 }, {
        key: 'Last 6 hrs', state: 'hours', step: 6
    }
    , { key: 'Last 12 hrs', state: 'hours', step: 12 }, {
        key: 'Last 24 hrs', state: 'hours', step: 24
    }
    , { key: 'Last 2 days', state: 'days', step: 2 }, {
        key: 'Last 7 days', state: 'days', step: 7
    }
]

export const _xAxes = [{ key: 'DATE-WISE', state: false },
{ key: 'LOCATION', state: false },
{ key: 'DEVICE', state: false }, {
    key: 'SENSOR', state: false
}]

export const _widgetSIZE = [{ name: 'Full width', file: 'col-md-12', isSelected: false },
{ name: 'Md width', file: 'col-md-7', isSelected: false },
{ name: 'Sm width', file: 'col-md-5', isSelected: false },
{ name: 'Min width', file: 'col-md-4', isSelected: false },
];
export const _mapTypes = [
{ name: 'MAPS', file: 'map-widget', isSelected: false },
// { name: 'Highlights', file: 'highlight-widget', isSelected: false },
// { name: 'TABLE', file: 'table-widget', isSelected: false },
// { name: 'Utility', file: 'guage-widget', isSelected: false },
// { name: 'ON/OFF Controls', file: 'onoff-widget', isSelected: false },
// { name: 'Activity Controls', file: 'activity-widget', isSelected: false },
// { name: 'Summary', file: 'summary-widget', isSelected: false },
// { name: 'Reports', file: 'reports-widget', isSelected: false },
];

export const _chartTYPE = [{ name: 'Bar', file: 'bar-chart', isSelected: false },
{ name: 'Line', file: 'line-chart', isSelected: false },
{ name: 'Donut', file: 'donut-chart', isSelected: false },
{ name: 'Pie', file: 'pie-chart', isSelected: false },
{ name: 'scatter', file: 'scatter-chart', isSelected: false },
{ name: 'gauge', file: 'guage-widget', isSelected: false },
];

export const _cardTYPE = [
{ name: 'Highlights', file: 'highlight-widget', isSelected: false },
{ name: 'TABLE', file: 'table-widget', isSelected: false },
{ name: 'Summary', file: 'summary-widget', isSelected: false },
{ name: 'Recent', file: 'recent', isSelected: false },
{ name: 'Progress', file: 'progress', isSelected: false },
];
export const _alertTYPE = [
    
    { name: 'Threshold alert', file: 'threshold', isSelected: false },
    { name: 'No data alert', file: 'no-data', isSelected: false },
    { name: 'Load excess', file: 'weight', isSelected: false },
    // { name: 'Reactive excess', file: 'guage-widget', isSelected: false },
    { name: 'ON/OFF', file: 'switch', isSelected: false },
    // { name: 'Activity Controls', file: 'activity-widget', isSelected: false },
    ];
export class widgetResponse {
    totalLocations: [] | undefined;
    locations: [] | undefined;
    protocol: {} | undefined;
    data: [] | undefined;
    status: '' | undefined;
    totalDevice: [] | undefined

};
export interface _widgetRequest {
    ASSET_CONFIG_ID: number,
    CHART_NAME: string,
    CONFIG_NAME: string,
    CONNECTION_TYPE: number,
    CREATED_BY: number,
    CREATED_DATE: string,
    IS_DRAGGED: number,
    MODIFY_BY: null
    MODIFY_DATE: null
    PID: number,
    SQL_QUERY: string,
    WIDGET_DATA: string,
    WIDGET_IMG: string,
    WIDGET_LABEL: null
    WIDGET_SIZE: string,
    WIDGET_TYPE: string,
    XAXES: string, top: number, left: number,
    dragDisabled: boolean,
    LOADED:any
}
export const _assetTypes = ['Security',
    'Activity Trackers',
    'Industrial Security and Safety',
    ' Augmented Reality',
    'Motion Detection'
];
export const _deviceType = ["IMEI", "MAC ADDRESS", "DEVICE ID"];
export const _alertType = ["SMS", "EMAIL", "PUSH NOTIFICATION"];

export interface __deviceHistory {
    PID: number;
    ASSET_CONFIG_ID: number;
    DEVICE_ID: any;
    VALUE: any;
    STATUS: any;
    LATITUDE: any;
    LONGITUDE: any;
    LOCATION: string;
}
export class plotly_small_layout {
    yaxis = { autorange: true, title: "" };
    showlegend = true;
    autosize = true;
    width = 500;
    height = 300;
    margin = {
        l: 50,
        r: 50,
        b: 50,
        t: 50,
        pad: 4
    };
    // paper_bgcolor: '#7f7f7f',
    // plot_bgcolor: '#c7c7c7'
}