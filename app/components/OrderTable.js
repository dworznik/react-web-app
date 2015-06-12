import FixedDataTable from 'fixed-data-table';
import React from 'react';
import $ from 'jquery';

var Table = FixedDataTable.Table;
var Column = FixedDataTable.Column;


 $.ajaxSetup({
  contentType: "application/json; charset=utf-8"
});

var OrderTable = React.createClass({

    updateState: function() {
        var self = this;
        // $.post('https://beta.ultra-coin.com:30051/v1',
        $.post('/v1',
            JSON.stringify({
                "method": "findorders",
                "id": 110,
                "params": [{
                    "query": {
                        "base_asset": "",
                        "denom_asset": "~BTC:SATOSHIS"
                    }
                }]
            }),
            function(res) {
                console.log('Updating table');
                console.log(res);
                var rows = $.parseJSON(res).result.results;
                self.setState({
                    rows: rows
                });
            });
    },

    getInitialState: function() {
        return {};
    },

    getRow: function(rowIndex) {
        return this != null ? this.state.rows[rowIndex] : null;
    },

    componentDidMount: function() {
        this.updateState();
        this.timer = setInterval(this.tick, 5000);
    },

    componentWillUnmount: function() {
        clearInterval(this.timer);
    },


    tick: function() {
        this.updateState();
    },

    render:  function() {
                if( this.state.rows ) {
                    return (<Table rowHeight = {50}
                    rowGetter = {this.getRow}
                    rowsCount = {this.state != null ? this.state.rows.length : 0}
                    width = {1000}
                    height = {500}
                    headerHeight = {50} >
                    <Column label="Pay"
                        width={200}
                        dataKey="base_asset" ></Column>
                    <Column label="Receive"
                        width={200}
                        dataKey="quote_asset"></Column>
                   <Column label="Principal"
                        width={200}
                        dataKey="base_principal"></Column>
                   <Column label="Collateral"
                        width={200}
                        dataKey="base_collateral_bp"></Column>
                  <Column label="Expiry"
                        width={200}
                        dataKey="swap_duration"></Column>
                        </Table>
                        )
                } else {
                    return (<img src="loading.gif"></img> )
                }
            }
});

export default OrderTable;
