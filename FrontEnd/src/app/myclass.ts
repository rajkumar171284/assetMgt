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
export const _widgetSIZE = [{ name: 'Full width', file: 'col-md-12', isSelected: false },
{ name: 'Md width', file: 'col-md-7', isSelected: false },
{ name: 'Sm width', file: 'col-md-5', isSelected: false },
{ name: 'Min width', file: 'col-md-4', isSelected: false },
];
export const _widgetTYPE = [{ name: 'CHARTS', file: 'chart-widget', isSelected: false },
{ name: 'MAPS', file: 'map-widget', isSelected: false },
{ name: 'Highlights', file: 'highlight-widget', isSelected: false },
{ name: 'TABLE', file: 'table-widget', isSelected: false },

];

export const _chartTYPE = [{ name: 'Bar', file: 'bar-chart', isSelected: false },
{ name: 'Line', file: 'line-chart', isSelected: false },
{ name: 'Donut', file: 'donut-chart', isSelected: false },
{ name: 'Pie', file: 'pie-chart', isSelected: false },
{ name: 'scatter', file: 'scatter-chart', isSelected: false }
];

export const _assetTypes = ['Security',
'Activity Trackers',
'Industrial Security and Safety',
' Augmented Reality',
'Motion Detection'
];
export const _deviceType=["IMEI","MAC ADDRESS"]