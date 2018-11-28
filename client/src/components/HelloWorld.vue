<template>
  <div class="hello">
    <input v-model="msg" type="text" placeholder="Enter your search term:"/>
    <input v-model="symbol" type="text" placeholder="TSLA"/>
    <h1>{{ msg }}</h1>
    <div id="chartContainer" style="height: 300px; width: 100%;"></div>
    <span>{{stock_results}}</span>
    <span>{{results}}</span>
  </div>
</template>

<script>
  import axios from 'axios';

export default {
  name: 'HelloWorld',
  data: () => {
    return {
      msg: "",
      results: Object,
        symbol: "TSLA",
        stock_results: Object
  }
},
  watch: {
      msg: function (value) {
          console.log(value)
        axios.get('/data/' + value)
            .then((res) => {
                console.log(res)
                this.results = res["data"]
            })
            .catch((error) => {
                if (error.response.status === 401) {
                  console.log(error)
                }
            })
      },
      symbol: function (value) {
          console.log(value)
          axios.get('https://api.iextrading.com/1.0/stock/' + value + "/chart/1m")
              .then((res) => {
                  console.log(res)
                  this.stock_results = res["data"]

                  var dataPoints = [];

                  var chart = new CanvasJS.Chart("chartContainer", {
                      animationEnabled: true,
                      theme: "dark2", // "light1", "light2", "dark1", "dark2"
                      exportEnabled: true,
                      title: {
                          text: value + " Stock Price last 30 Days"
                      },
                      subtitles: [{
                          text: "Average"
                      }],
                      axisX: {
                          interval: 1,
                          valueFormatString: "MMM/D"
                      },
                      axisY: {
                          includeZero: false,
                          prefix: "$",
                          title: "Price"
                      },
                      toolTip: {
                          content: "Date: {x}<br /><strong>Price:</strong><br />Open: {y[0]}, Close: {y[3]}<br />High: {y[1]}, Low: {y[2]}"
                      },
                      data: [{
                          type: "candlestick",
                          yValueFormatString: "$##0.00",
                          dataPoints: dataPoints
                      }]
                  });
                  res["data"].forEach((data_point) => {
                      dataPoints.push({
                          x: new Date(
                              parseInt(data_point["date"].split("-")[0]),
                              parseInt(data_point["date"].split("-")[1] - 1),
                              parseInt(data_point["date"].split("-")[2])
                          ),
                          y: [
                              parseFloat(data_point["open"]),
                              parseFloat(data_point["high"]),
                              parseFloat(data_point["low"]),
                              parseFloat(data_point["close"])
                          ]
                      });

                  })

                  chart.render();

              })
              .catch((error) => {
                  if (error.response.status === 401) {
                      console.log(error)
                  }
              })
      }
  }

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
