import { Injectable } from '@angular/core';
import echarts from 'echarts';
@Injectable()
export class EchartsService {
  constructor() { }
  /*********** 月发电量月计划发电量 ************/
  initEc1(chartOption, theme = null) {
    return {
      tooltip: {
        show: true,
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          lineStyle: {
            color: '#FFF',
            type: 'dashed',
          },
          crossStyle: {
            color: '#FFF',
          },
        },
      },
      grid: {
        left: 10,
        top: 30,
        right: 10,
        bottom: 10,
      },
      color: [theme === 'dark-theme' ? '#00E3ED' : '#fff', '#F5F908'],
      legend: {
        left: 'left',
        top: 'top',
        orient: 'vertical',
        icon: 'circle',
        textStyle: {
          color: '#FFF',
          fontSize: 10,
        },
        data: chartOption.legend.data,
      },
      xAxis: {
        type: 'category',
        data: chartOption.xAxis.data,
        boundaryGap: false,
        splitNumber: 12,
        minInterval: 12,
        axisLine: { show: false },
        axisTick: {
          interval: 0,
          show: true,
          inside: true,
          lineStyle: {
            color: '#FFF',
            width: 1,
          },
        },
        axisLabel: { show: false },
      },
      yAxis: [
        {
          show: false,
          name: '电量(万KWh)',
          type: 'value',
        },
      ],
      series: [
        {
          name: chartOption.series[0].name,
          data: chartOption.series[0].data,
          type: 'line',
          smooth: true,
          symbolSize: 1,
        },
        {
          name: chartOption.series[1].name,
          data: chartOption.series[1].data,
          type: 'line',
          smooth: true,
          symbolSize: 1,
        },
      ],
    };
  }
  initEc2(axisData) {
    return {
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b} : {c} ({d}%)',
      },
      grid: {
        bottom: '15',
      },
      series: [
        {
          name: '饼图二',
          type: 'pie',
          clockWise: false,
          hoverAnimation: false,
          radius: ['76%', '92%'],
          label: {
            normal: {
              position: 'center',
            },
          },
          data: [
            {
              value: axisData,
              name: '占有率',
              itemStyle: {
                normal: {
                  color: new echarts.graphic.LinearGradient(1, 1, 0, 1, [
                    {
                      offset: 0,
                      color: '#ead36f',
                    },
                    {
                      offset: 1,
                      color: '#a9f9b8',
                    },
                  ]),
                },
              },
              label: {
                normal: {
                  show: false,
                  // formatter: '{d} %',
                  // textStyle: {
                  //     fontSize: 50
                  // }
                },
              },
            },
            {
              value: 100 - axisData,
              // name: '占位',
              hoverAnimation: false,
              // label: {
              //     normal: {
              //         formatter: '\n实施功率\n' + axisData + '万KW\n' + '容量-1.02GW',
              //         textStyle: {
              //             color: '#000',//字体颜色
              //             fontSize: 12
              //         }
              //     }
              // },
              tooltip: {
                show: true,
              },
              itemStyle: {
                normal: {
                  color: '#92cbf1',
                },
                emphasis: {
                  color: '#red',
                },
              },
            },
          ],
        },
      ],
    };
  }
  initEc3(chartOption, theme = null) {
    const color = '#3D7C88';
    return {
      tooltip: {
        show: true,
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          lineStyle: {
            color: '#D4D4D4',
            type: 'dashed',
          },
          crossStyle: {
            color: '#D4D4D4',
          },
        },
      },
      grid: {
        left: '4%',
        right: '4%',
        top: '50',
        bottom: '3%',
        containLabel: true,
      },
      title: {
        text: chartOption.title.text,
        top: 'top',
        left: 10,
        textStyle: { fontSize: 14, color: '#3F4248' }
      },
      color: ['rgba(91,143,249,0.85)', 'rgba(90,216,166,0.85)'],
      legend: {
        left: 'right',
        top: 'top',
        textStyle: { color: '#5C6370', fontSize: 12 },
        data: chartOption.legend.data,
        itemWidth: 8,
        itemHeight: 8,
      },
      xAxis: {
        type: 'category',
        data: chartOption.xAxis.data,
        axisLine: {
          show: true,
          lineStyle: {
            color: theme === 'dark-theme' ? color : '#999',
            width: 1,
            fontSize: 7,
          },
        },
        axisTick: {
          show: false,
        },
        axisLabel: { show: true, color: '#5C6370' },
      },
      yAxis: [
        {
          show: true,
          type: 'value',
          splitNumber: 3,
          textStyle: {
            fontSize: 10,
            color: '#5C6370'
          },
          axisLine: {
            show: false,
          },
          axisTick: {
            show: false,
          },
          axisLabel: { show: true, color: '#5C6370' },
        },
      ],
      series: [
        {
          name: chartOption.series[0].name,
          data: chartOption.series[0].data,
          type: 'bar',
          // smooth: true,
          symbolSize: 1,
        },
        {
          name: chartOption.series[1].name,
          data: chartOption.series[1].data,
          type: 'bar',
          // smooth: true,
          symbolSize: 1,
        },
      ],
    };
  }
  initEc4(axisData, theme = null, sort) {
    /* 正序：asc 倒序：desc */
    let len = axisData.yAxisData.length;
    for (var i = 0; i < len; i++) {
      for (let j = 0; j < len - 1 - i; j++) {
        if (axisData.yAxisData[j] < axisData.yAxisData[j + 1]) {
          let temp = axisData.xAxisData[j];
          let temp2 = axisData.yAxisData[j];
          axisData.xAxisData[j] = axisData.xAxisData[j + 1];
          axisData.xAxisData[j + 1] = temp;
          axisData.yAxisData[j] = axisData.yAxisData[j + 1];
          axisData.yAxisData[j + 1] = temp2;
        }
      }
    }
    // 排序后倒序需要倒转
    if (sort = "desc") {
      axisData.xAxisData.reverse();
      axisData.yAxisData.reverse();
    }

    return {
      tooltip: {
        show: false,
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
        },
      },
      grid: {
        top: '5%',
        left: '12%',
        bottom: '0%',
        containLabel: false,
      },
      // x轴的数据和样式
      xAxis: {
        type: 'value',
        axisTick: { show: false },
        axisLine: { show: false },
        axisLabel: { show: false },
        splitLine: { show: false }
      },
      // y轴的数据和样式
      yAxis: [
        {
          type: 'category',
          axisLabel: {
            color: '#3F4248',
            show: true,
            margin: 0,
            align: 'left',
            fontSize: 13,
            verticalAlign: 'bottom',
            padding: [5, 10, 2, -34],
            formatter: (value, index) => {
              let no = -(index - axisData.xAxisData.length);
              // let no = index + 1;  
              return '{' + no + '| }\r\r\r' + value.split(' ')[0];
            },
            rich: {
              1: {
                height: 24,
                width: 24,
                padding: [0, 0, 0, 0],
                backgroundColor: {
                  image: `assets/imgs/monitor/chart_rank/no1.png`,
                },
              },
              2: {
                height: 24,
                width: 24,
                padding: [0, 0, 0, 0],
                backgroundColor: {
                  image: `assets/imgs/monitor/chart_rank/no2.png`,
                },
              },
              3: {
                height: 24,
                width: 24,
                padding: [0, 0, 0, 0],
                backgroundColor: {
                  image: `assets/imgs/monitor/chart_rank/no3.png`,
                },
              },
              4: {
                height: 24,
                width: 24,
                padding: [0, 0, 0, 0],
                backgroundColor: {
                  image: `assets/imgs/monitor/chart_rank/no4.png`,
                },
              },
              5: {
                height: 24,
                width: 24,
                padding: [0, 0, 0, 0],
                backgroundColor: {
                  image: `assets/imgs/monitor/chart_rank/no5.png`,
                },
              },
              6: {
                height: 24,
                width: 24,
                padding: [0, 0, 0, 0],
                backgroundColor: {
                  image: `assets/imgs/monitor/chart_rank/no6.png`,
                },
              },
            }
          },
          axisTick: { show: false },
          axisLine: { show: false },
          data: axisData.xAxisData,
        },
        {
          type: 'category',
          axisLine: { show: false },
          axisTick: { show: false },
          axisLabel: {
            color: '#2A2B2F',
            show: true,
            margin: 0,
            fontSize: 13,
            align: 'right',
            verticalAlign: 'top',
            padding: [5, 0, 8, -15],
            formatter: (value) => {
              return value.split(' ')[1];
            },
            zIndex: 1000,
          },
          data: axisData.xAxisData
        }
      ],
      series: [
        {
          name: ' ',
          type: 'bar',
          yAxisIndex: 1,
          silent: true,
          barWidth: 10,
          itemStyle: {
            normal: {
              show: false,
              color: '#D5DDE3',
              borderWidth: 0,
              borderRadius: 5,
              barBorderRadius: 5
            }
          },
          barCategoryGap: '20%',
          data: this.allmax(axisData.yAxisData),
        },
        {
          name: '时间区间',
          type: 'bar',
          barWidth: 8,
          itemStyle: {
            normal: {
              show: false,
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: '#4db8ff',
                }]),
              borderWidth: 0,
              borderRadius: 5,
              barBorderRadius: 5
            },
          },
          barCategoryGap: '20%',
          data: axisData.yAxisData,
        },
      ],
    };
  }

  center = {
    normal: {
      position: 'center',
    },
  };
  textStyle = {
    color: '#ffffff',
    fontSize: 12,
  };
  radiusCncircle = ['35%', '39%'];
  itemStyle = {
    normal: { color: '#fff' },
  };
  placeHolderStyle = {
    normal: {
      color: '#90c8ed', //未完成的圆环的颜色
      labelLine: {
        show: false,
      },
    },
  };
  initEc5(subInfos, theme = null) {
    const itemStyle = {
      normal: { color: '#00E3ED' },
    };
    const placeHolderStyle = {
      normal: {
        color: '#003740', //未完成的圆环的颜色
        labelLine: {
          show: false,
        },
      },
    };
    const textStyle = {
      color: '#B9FCFF',
      fontSize: 12,
    };
    return {
      series: [
        {
          type: 'pie',
          clockWise: false,
          center: ['15%', '25%'],
          radius: this.radiusCncircle,
          hoverAnimation: false,
          avoidLabelOverlap: false,
          label: this.center,
          data: [
            {
              value: subInfos[0].ratio,
              name: '01',
              label: {
                normal: {
                  formatter: subInfos[0].title,
                  textStyle:
                    theme === 'dark-theme' ? textStyle : this.textStyle,
                },
              },
              itemStyle: theme === 'dark-theme' ? itemStyle : this.itemStyle,
            },
            {
              value: 100 - subInfos[0].ratio,
              itemStyle:
                theme === 'dark-theme'
                  ? placeHolderStyle
                  : this.placeHolderStyle,
              hoverAnimation: false,
            },
          ],
        },
        {
          type: 'pie',
          clockWise: false,
          center: ['60%', '25%'],
          radius: this.radiusCncircle,
          hoverAnimation: false,
          avoidLabelOverlap: false,
          label: this.center,
          data: [
            {
              value: subInfos[1].ratio,
              name: '01',
              label: {
                normal: {
                  formatter: subInfos[1].title,
                  textStyle:
                    theme === 'dark-theme' ? textStyle : this.textStyle,
                },
              },
              itemStyle: theme === 'dark-theme' ? itemStyle : this.itemStyle,
            },
            {
              value: 100 - subInfos[1].ratio,
              itemStyle:
                theme === 'dark-theme'
                  ? placeHolderStyle
                  : this.placeHolderStyle,
              hoverAnimation: false,
            },
          ],
        },
        {
          type: 'pie',
          clockWise: false,
          center: ['15%', '72%'],
          radius: this.radiusCncircle,
          hoverAnimation: false,
          avoidLabelOverlap: false,
          label: this.center,
          data: [
            {
              value: subInfos[2].ratio,
              name: '01',
              label: {
                normal: {
                  formatter: subInfos[2].title,
                  textStyle:
                    theme === 'dark-theme' ? textStyle : this.textStyle,
                },
              },
              itemStyle: theme === 'dark-theme' ? itemStyle : this.itemStyle,
            },
            {
              value: 100 - subInfos[2].ratio,
              itemStyle:
                theme === 'dark-theme'
                  ? placeHolderStyle
                  : this.placeHolderStyle,
              hoverAnimation: false,
            },
          ],
        },
        {
          type: 'pie',
          clockWise: false,
          center: ['60%', '72%'],
          radius: this.radiusCncircle,
          hoverAnimation: false,
          avoidLabelOverlap: false,
          label: this.center,
          data: [
            {
              value: subInfos[3].ratio,
              name: '01',
              label: {
                normal: {
                  formatter: subInfos[3].title,
                  textStyle:
                    theme === 'dark-theme' ? textStyle : this.textStyle,
                },
              },
              itemStyle: theme === 'dark-theme' ? itemStyle : this.itemStyle,
            },
            {
              value: 100 - subInfos[3].ratio,
              itemStyle:
                theme === 'dark-theme'
                  ? placeHolderStyle
                  : this.placeHolderStyle,
              hoverAnimation: false,
            },
          ],
        },
      ],
    };
  }

  /**
   * 得到数据最大值
   */
  allmax(a: number[]) {
    const max = Math.max.apply(null, a);
    let arr = new Array(a.length);
    for (let i = 0; i < arr.length; i++) {
      // arr[i] = (Number(Math.round(max).toString().substr(0, 1)) + 1) * Math.pow(10, Math.round(max).toString().length - 1);
      arr[i] = 100;
    }
    return arr;
  }
  buildNullArr(a: number[]) {
    let ar = new Array(a.length);
    for (let i = 0; i < a.length; i++) {
      ar[i] = '';
    }
    return ar;
  }

  /**
   * 运行效率
   * @param datas
   * @param datas
   * @param datas
   */
  buildYXXLGroupEchartOption(datas) {
    var option = {
      tooltip: {
        trigger: 'axis',
        confine: true,
        formatter: '{b}: {c}',
      },
      grid: {
        left: '5%',
        right: '5%',
        top: '17%',
        bottom: '5%',
        containLabel: false,
      },
      xAxis: {
        type: 'category',
        // data: ['90%-100%', '80%-90%', '70%-80%', '60%-70%', '50%-60%', '40%-50%', '30%-40%', '20%-30%', '10%-20%', '0%-10%'],
        axisLine: { show: false },
        splitLine: { show: false },
        axisLabel: { show: false },
        axisTick: { show: false },
      },
      yAxis: {
        type: 'value',
        axisLine: { show: false },
        splitLine: { show: false },
        axisLabel: { show: false },
        axisTick: { show: false },
      },
      series: [
        {
          type: 'bar',
          label: {
            show: true,
            position: 'top',
            color: '#dedbdb',
            fontSize: 10,
          },
          color: '#5daee5',
          data: datas,
        },
      ],
    };
    return option;
  }

  /**
   * 损失电量统计
   * 损失电量
   * @param datas
   * @param datas
   * @param datas
   */
  buildSSDLTJEchartOption(datas, type) {
    let option = {};
    if (type === 'lossNum') {
      option = {
        grid: {
          left: '20%',
          right: '20%',
          containLabel: true,
        },
        title: {
          show: true,
          text: '发生次数',
          left: 'center',
          textStyle: {
            fontSize: 12,
          },
        },
        tooltip: {
          show: true,
          formatter: '{b}: {c} 次',
        },
        series: [
          {
            type: 'pie',
            radius: '50%',
            center: ['50%', '55%'],
            data: datas,
            label: {
              show: true,
              formatter: '{b}:\n{c} 次',
              position: 'outer',
            },
          },
        ],
      };
    } else {
      option = {
        grid: {
          top: '10%',
          containLabel: true,
        },
        title: {
          show: true,
          text: '损失电量',
          left: 'center',
          textStyle: {
            fontSize: 12,
          },
        },
        tooltip: {
          show: true,
          formatter: '{b}: {c} kWh',
        },
        series: [
          {
            type: 'pie',
            radius: '55%',
            center: ['50%', '55%'],
            data: datas,
            label: {
              show: true,
              formatter: '{b}:\n{c} kWh',
              position: 'outer',
            },
          },
        ],
      };
    }

    return option;
  }

  /**运维界面图表 */
  bulidOrdersTypeEchartOption(datas, rate) {
    return {
      color: ['#F2F9FF', '#91CBF1'],
      grid: {
        left: '20%',
        right: '20%',
        containLabel: true,
      },
      title: {
        text: rate,
        left: 'center',
        top: 'middle',
        itemGap: 0,
        textStyle: { fontSize: '32', color: '#FFFFFF' },
        subtext: '完成率(%)',
        subtextStyle: { fontSize: '10', color: '#FFFFFF' },
        borderWidth: 0,
      },
      tooltip: {
        show: false,
      },
      series: [
        {
          type: 'pie',
          radius: ['65%', '75%'],
          center: ['50%', '50%'],
          data: datas,
          label: {
            show: false,
          },
        },
      ],
    };
  }
}
