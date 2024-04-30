import echarts from 'echarts';

export function buildDeviceTopo(data, deviceId) {
  if (data) {
    if (data.data.deviceId === deviceId) {
      data.name = data.data.deviceName;
      data.itemStyle = {
        color: '#37A2DA',
        borderWidth: 0,
        borderColor: '#37A2DA'
      };
      if (data.children) {
        data.children.map((item) => {
          item.name = item.data.deviceName;
          item.itemStyle = {
            color: '#9FE6B8',
            borderWidth: 8,
            borderColor: '#9FE6B8'
          };
        });
      }
    } else {
      data.name = data.data.deviceName;
      data.itemStyle = {
        color: '#9FE6B8',
        borderWidth: 0,
        borderColor: '#9FE6B8'
      };
      if (data.children) {
        data.children.map((item) => {
          item.name = item.data.deviceName;
          item.itemStyle = {
            color: '#37A2DA',
            borderWidth: 8,
            borderColor: '#37A2DA'
          };
          if (item.children) {
            item.children.map((i) => {
              i.name = i.data.deviceName;
              i.itemStyle = {
                color: '#9FE6B8',
                borderWidth: 0,
                borderColor: '#9FE6B8'
              };
            });
          }
        });
      }
    }
  }

  console.log({
    //color: ['#2196F3', '#FFC107', '#45A349', '#FF5722', '#9C27B0', '#7FBCEC', '#21C7E2', '#84A9C1', '#409E8F'],
    backgroundColor: 'rgba(255, 255, 255, 0)',
    tooltip: {
      trigger: 'none'
    },
    series: [
      {
        left: '20%',
        right: '20%',
        layout: 'orthogonal',
        orient: 'TB',
        type: 'tree',
        symbol: 'circle',
        symbolSize: 16,
        roam: true,
        initialTreeDepth: 2,
        itemStyle: {
          borderWidth: 1
        },
        label: {
          normal: {
            position: 'top',
            verticalAlign: 'middle',
            align: 'center',
            fontSize: 14
          }
        },
        leaves: {
          label: {
            normal: {
              rotate: 45,
              position: 'top',
              verticalAlign: 'middle',
              align: 'center',
              fontSize: 10
            }
          }
        },
        data: [data]
      }
    ]
  });

  return {
    //color: ['#2196F3', '#FFC107', '#45A349', '#FF5722', '#9C27B0', '#7FBCEC', '#21C7E2', '#84A9C1', '#409E8F'],
    backgroundColor: 'rgba(255, 255, 255, 0)',
    tooltip: {
      trigger: 'none'
    },
    series: [
      {
        left: '20%',
        right: '20%',
        layout: 'orthogonal',
        orient: 'TB',
        type: 'tree',
        symbol: 'circle',
        symbolSize: 16,
        roam: true,
        initialTreeDepth: 2,
        itemStyle: {
          borderWidth: 1
        },
        label: {
          normal: {
            position: 'top',
            verticalAlign: 'middle',
            align: 'center',
            fontSize: 14
          }
        },
        leaves: {
          label: {
            normal: {
              rotate: 45,
              position: 'top',
              verticalAlign: 'middle',
              align: 'center',
              fontSize: 10
            }
          }
        },
        data: [data]
      }
    ]
  };
}
