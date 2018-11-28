<template>
  <div class="container-fluid">
    <h1>TastyWorks Coding Project</h1>
    <div class="dropdown nav-item">
      <input
              v-model="search_value"
              class="dropdown-toggle form-control live-search-box"
              id="quicksearch"
              data-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="false"
              placeholder="Company Name/Stock Symbol">
      <div class="dropdown-menu" v-bind:class="{ show: showSearchResults }">
        <li v-for="stock in stock_search">
          <button class="btn" v-on:click="search_value = stock.Name; symbol = stock.Symbol; showSearchResults = false">{{stock.Symbol}} {{stock.Name}}</button>
        </li>
      </div>
    </div>
    <div id="chartContainer" style="height: 500px; width: 100%;"></div>
  </div>
</template>

<script>
    import axios from 'axios';

    export default {
        name: 'StockSearch',
        data: () => {
            return {
                search_value: "",
                stocks: Object,
                stock_search: Object,
                symbol: "",
                showSearchResults: false
            }
        },

        beforeMount(){
            this.getStocks()
        },
        methods: {
            getStocks: function() {

                axios.get('/data')
                    .then((res) => {
                        this.stocks = JSON.parse(res["data"]).sort(function(a, b) {
                            return a.Name.localeCompare(b.Name);
                        })
                    })
            }
        },
        watch: {
            search_value: function (value) {
                var searchTerm = value.toLowerCase();
                this.stock_search = this.stocks.filter((stock) => stock["Name"].toLowerCase().includes(searchTerm) || stock["Symbol"].toLowerCase().includes(searchTerm))
                this.showSearchResults = this.stock_search.length > 1 || (this.stock_search.length == 1 && value !== this.stock_search[0].Name && value !== this.stock_search[0].Symbol);
                },
            symbol: function (value) {
                axios.get('https://api.iextrading.com/1.0/stock/' + value + "/chart/1m")
                    .then((res) => {

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
                                dataPoints: dataPoints,
                                risingColor: "#00FF00",
                                fallingColor: "#FF0000",
                                color:"#000000"
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
            }
        }

    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
  body {
    background-color: #32373a;
    color: #fff;
  }
  .btn {
    background-color: #000;
    color: #00FF00;
  }
  .container-fluid {
    width: 100%;
    padding-right: 30px;
    padding-left: 30px;
    margin-right: auto;
    margin-left: auto;
  }
  .live-search-box {
    margin-left: auto;
    margin-right: auto;
    width: 75%;
    margin-top: 50px;
    margin-bottom: 50px;
    text-align: left;
  }
  .dropdown-menu {
    background-color: #32373a;
    width: 75%;
    margin-left:12.5%;
  }
  .dropdown-menu li {
    margin-top: 4px;
  }
  h1, h2, h3 {
    color:#FFFFFF;
  }
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
