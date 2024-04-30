import echarts from 'echarts';

export function buildWorkFlow(links, nodes) {
  //节点样式
  var itemStyles = {
    '01': { color: '#5EADE7', borderColor: '#AFD6F3', borderWidth: 3 },
    '02': { color: '#70AD47', borderColor: '#C5E0B3', borderWidth: 3 },
    '03': { color: '#BFBFBF', borderColor: '#D8D8D8', borderWidth: 3 }
  };

  var symbolSize = 20;

  //根据节点状态动态修改节点name：把已完成节点和当前节点的name改为带用户名的name
  var objects = {};
  for (var i in nodes) {
    nodes[i]['children'] = [];
    nodes[i]['parents'] = [];
    nodes[i]['nodeName'] = nodes[i].name;
    if (nodes[i].status == '01') {
      nodes[i].statusText = '已完成';
    } else if (nodes[i].status == '02') {
      nodes[i].statusText = '执行中';
    } else {
      nodes[i].statusText = '未开始';
    }
    if (nodes[i].status == '01' || nodes[i].status == '02') {
      var newName = nodes[i].name + '\n' + nodes[i].user;
      for (var j in links) {
        if (links[j].source == nodes[i].name) {
          links[j].source = newName;
        }
        if (links[j].target == nodes[i].name) {
          links[j].target = newName;
        }
      }
      nodes[i].name = newName;
    }
    objects[nodes[i].name] = nodes[i];
  }

  //1. 对于死循环节点，设置线条为弧形，避免来回两条线条重合
  //2. 更新所有节点的父节点列表和子节点列表
  for (let i = 0; i < links.length; ++i) {
    for (let j = i; j < links.length; ++j) {
      if (
        links[i].source == links[j].target &&
        links[i].target == links[j].source
      ) {
        links[i].lineStyle = { curveness: 0.2 };
        links[j].lineStyle = { curveness: 0.2 };
      }
    }
    objects[links[i].source].children.push(objects[links[i].target]);
    objects[links[i].target].parents.push(objects[links[i].source]);
  }

  //找到根节点，根节点只能有一个
  var root = null;
  for (var i in objects) {
    if (objects[i].parents.length == 0) {
      root = objects[i];
    }
  }

  root.level = 0;
  root.back = false;
  root.x = 0;
  root.y = 0;
  function setLevel(parent, node) {
    for (var i in node.children) {
      //标记死循环节点
      node.back = parent != null && parent.name == node.children[i].name;

      //设置每个节点的级别，为了避免死循环，已经标记过的节点不重复标记
      if (node.children[i].level == null) {
        node.children[i].level = node.level + 1;
        if (parent == null || parent.name != node.children[i].name) {
          setLevel(node, node.children[i]);
        }
      } else if (
        node.children[i].nodeType == '05' &&
        node.level >= node.children[i].level
      ) {
        //05是正常结束节点，不会死循环也不会有子节点，正常情况下应该赋值到可能的最大层级
        node.children[i].level = node.level + 1;
      }
    }
  }
  setLevel(null, root);

  //按级别汇总节点对象
  var levels = {};
  for (var i in objects) {
    if (levels[objects[i].level] == undefined) {
      if (objects[i].back != true && objects[i].children.length > 0) {
        levels[objects[i].level] = {
          main: objects[i],
          others: []
        };
        objects[i].main = true;
      } else {
        levels[objects[i].level] = {
          main: null,
          others: [objects[i]]
        };
      }
    } else {
      if (objects[i].back != true && objects[i].children.length > 0) {
        if (levels[objects[i].level].main != null) {
          levels[objects[i].level].others.push(objects[i]);
        } else {
          levels[objects[i].level].main = objects[i];
          objects[i].main = true;
        }
      } else {
        levels[objects[i].level].others.push(objects[i]);
      }
    }
    //纵坐标按级别递增分配
    objects[i].y = objects[i].level * 5;
  }

  //横坐标在同一个级别内计算
  for (const i in levels) {
    if (levels.hasOwnProperty(i)) {
      var offset = 0;
      //保持最长主线上的节点排成中间的纵向直线
      if (levels[i].main != null) {
        levels[i].main.x = 0;
        offset = 1;
      }
      //修正结束节点未标记为main的问题
      if (levels[i].main == null && levels[i].others.length == 1) {
        levels[i].main = levels[i].others[0];
        levels[i].main.main = true;
      }
      //非最长主线上的节点在主线两层顺序展开
      for (const j in levels[i].others) {
        if (levels[i].others.hasOwnProperty(j)) {
          if (parseInt(j) % 2 == 0) {
            levels[i].others[j].x = (parseInt(j) + offset) * 10;
          } else {
            levels[i].others[j].x =
              (parseInt(j) + offset - 1) * -10;
          }
        }
      }
    }
  }

  //创建图表用的nodes
  var datas = [];
  for (var i in objects) {
    datas.push({
      name: objects[i].name,
      x: objects[i].x,
      y: objects[i].y,
      itemStyle: itemStyles[objects[i].status],
      user: objects[i].user,
      nodeName: objects[i].nodeName,
      statusText: objects[i].statusText
    });
  }

  //主线上如果有多条相互重叠在一起的连线，则把其中跨级别的变成弧线
  for (var i in links) {
    if (objects[links[i].source].main && objects[links[i].target].main) {
      if (
        objects[links[i].source].level <
        objects[links[i].target].level - 1
      ) {
        links[i].lineStyle = { curveness: -0.3 };
      }
      if (
        objects[links[i].source].level > objects[links[i].target].level
      ) {
        links[i].lineStyle = { curveness: 0.3 };
      }
    }
  }
  //////////////////////////////////////////////////////////////////

  // 指定图表的配置项和数据
  var option = (option = {
    tooltip: {
      formatter: function (param) {
        if (param.dataType == 'node') {
          return (
            '节点: ' +
            param.data.nodeName +
            '</br>用户: ' +
            param.data.user +
            '</br>状态: ' +
            param.data.statusText +
            '</br>'
          );
        } else {
          return null;
        }
      }
    },
    //animationDurationUpdate: 1500,
    //animationEasingUpdate: 'quinticInOut',
    series: [
      {
        type: 'graph',
        roam: false,
        layout: 'none', //none, circular, force
        draggable: true,
        focusNodeAdjacency: true,
        symbol: 'circle', //'circle', 'rect', 'roundRect', 'triangle', 'diamond', 'pin', 'arrow', 'none'
        symbolSize: symbolSize,
        label: {
          show: true,
          position: 'right',
          color: '#727272'
        },
        edgeSymbol: ['circle', 'arrow'],
        edgeSymbolSize: [4, 8],
        lineStyle: {},
        data: datas,
        // links: [],
        links: links
      }
    ]
  });
  return option;
}
