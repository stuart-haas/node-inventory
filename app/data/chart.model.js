const distinctColors = require('distinct-colors');
const rgbHex = require('rgb-hex');

class Chart {
  constructor(data, type, labelKey, dataKey){
    this.length = data.length;
    this.data = this._arrayToObject(data);
    this.config = {type: type,
      data: {
        labels: [],
        datasets: [{
          backgroundColor: [],
          data: []
        }]
      },
      options: {
        legend: {
          display: false
        }
      }
    }
    this._generate(labelKey, dataKey);
  }

  _generate(labelKey, dataKey) {
    var palette = distinctColors({count: this.length, hueMin: 150, hueMax: 250, lightMin: 50, lightMax: 100});
    var colors = [];

    for(var i = 0; i < palette.length; i ++) {
      colors.push('#'+rgbHex(palette[i]._rgb.toString()));
    }

    this.config.data.labels = Object.keys(this.data).map(val => this.data[val][labelKey]);
    this.config.data.datasets[0].data = Object.keys(this.data).map(val => this.data[val][dataKey]);
    this.config.data.datasets[0].backgroundColor = colors;
  }

  _arrayToObject(array) {
    return array.reduce((obj, item) => {
      obj[item.id] = item
      return obj
    }, {});
  }
}

module.exports = Chart;