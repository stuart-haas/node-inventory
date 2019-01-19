const distinctColors = require('distinct-colors');
const rgbHex = require('rgb-hex');

class Chart {
  constructor(data, type, labelKey, dataKey){
    this.data = data;
    this.mData = this._arrayToObject(data);
    this._config = {type: type,
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
    this.draw(labelKey, dataKey);
  }

  draw(labelKey, dataKey) {
    var palette = distinctColors({count: this.data.length, hueMin: 150, hueMax: 250, lightMin: 50, lightMax: 100});
    var colors = [];

    for(var i = 0; i < palette.length; i ++) {
      colors.push('#'+rgbHex(palette[i]._rgb.toString()));
    }

    this._config.data.labels = Object.keys(this.mData).map(val => this.mData[val][labelKey]);
    this._config.data.datasets[0].data = Object.keys(this.mData).map(val => this.mData[val][dataKey]);
    this._config.data.datasets[0].backgroundColor = colors;
  }

  get config() {
    return JSON.stringify(this._config);
  }

  _arrayToObject(array) {
    return array.reduce((obj, item) => {
      obj[item.id] = item
      return obj
    }, {});
  }
}

module.exports = Chart;