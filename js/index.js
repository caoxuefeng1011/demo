var basUrl = 'http://112.74.193.71:8069/ezApi';
var BD = {};
//清空数据
function clearText() {
    $('#discussion').text('');
}
//POST方式获取数据
function get_data_wcf(action, param, onsuccess, onerror) {
    var url = basUrl + action;
    $.ajax({
        url: url,
        type: "POST",
        data: param,
        dataType: "json",
        success: function(returnValue) {
            onsuccess && onsuccess(returnValue);
        },
        error: function(err) {
            onerror && onerror(err);
        }
    });
}
//获取登录信息
function getLoginInfo() {
    var UserName = $('#userName').val();
    var Password = $('#password').val();
    return logonInfo = { UserName: UserName, Password: Password, IP: "127.0.0.1", Port: 4063, MobileType: "FRD-AL10", AndroidID: "5b937934a124f2cb", IsFirst: true };
}
//获取合约数据(未登录)
function getContractUnlogin() {
    get_data_wcf('/rmm/step30_contract', "", function(ans) {
        console.log(ans)
        var contracts = [];
        var quotes = {};
        ans.contracts.forEach(function(p) {
            var conObj = {
                SecurityDesc: p.split(',')[0],
                DisplayName: p.split(',')[1],
                ExchCode: p.split(',')[2],
                ID: parseInt(p.split(',')[3]),
                PFCode: p.split(',')[4],
                Period: parseInt(p.split(',')[5]),
                SettlementPrice: parseFloat(p.split(',')[6]),
                IsMostActive: p.split(',')[7] == "1",
                Kind: parseInt(p.split(',')[8])
            };
            contracts.push(conObj);
        });
        ans.quotes.forEach(function(p) {
            var quoInfo = {
                AskPx: parseFloat(p.Value.split(',')[0]),
                AskQty: parseInt(p.Value.split(',')[1]),
                BidPx: parseFloat(p.Value.split(',')[2]),
                BidQty: parseInt(p.Value.split(',')[3]),
                ContractID: parseInt(p.Value.split(',')[4]),
                HighPx: parseFloat(p.Value.split(',')[5]),
                LastPx: parseFloat(p.Value.split(',')[6]),
                LastQty: parseInt(p.Value.split(',')[7]),
                LowPx: parseFloat(p.Value.split(',')[8]),
                OpenPx: parseFloat(p.Value.split(',')[9]),
                RecieveTime: parseInt(p.Value.split(',')[10]),
                TotalQty: parseInt(p.Value.split(',')[11]),
            };
            quotes[p.Key] = quoInfo;
        });
        var cts = JSON.stringify(contracts)
        var qts = JSON.stringify(quotes)
        $('#discussion').append('<li><strong>' + 'contrracts:' + '</strong>&nbsp;&nbsp;' + cts + '</li>');
        $('#discussion').append('<li><strong>' + 'quotes:' + '</strong>&nbsp;&nbsp;' + qts + '</li>');
    }, function(err) {
        console.log(err)
    })
}
//登录
function login() {
    getLoginInfo();
    get_data_wcf('/rmm/step1_login', JSON.stringify(logonInfo), function(ans) {
        console.log(ans);
        BD.ticket = ans.Ticket;
        BD.userName = ans.UserName;
        BD.AccID = ans.AccID;
        BD.logInfo = { UserName: ans.UserName, Account_Id: ans.AccID, TicketString: ans.Ticket };

        $.connection.hub.qs = { "ticket": BD.ticket };
        $.connection.hub.start().done(function() {
            //重复登录处理
            rmm.server.regDuplicatedLogon(BD.ticket);
            //通知API IceUser登录成功
            rmm.server.iceUserLogin(logonInfo.UserName);
        });
        alert(ans.Message);
        $('#discussion').append('<li><strong>' + '登录成功返回信息:' + '</strong>&nbsp;&nbsp;' + JSON.stringify(ans) + '</li>');
    }, function(err) {
        console.log(err)
    })
}
//获取基础数据
function getBasic() {
    getLoginInfo();
    get_data_wcf('/rmm/step2_basic', '', function(ans) {
        console.log(ans)
        var basic = {};
        if (ans.Data) {
            //货币信息
            basic.Currencies = [];
            var curStr = ans.Data[0];
            curStr.forEach(function(p) {
                basic.Currencies.push({ Code: p.split(',')[0], Sysmbol: p.split(',')[1] });
            });

            //交易所信息
            basic.Exchanges = [];
            var exStr = ans.Data[1];
            exStr.forEach(function(p) {
                var exObj = { Code: p.split(',')[0] };
                exObj.AllowOrdTypes = [];
                var allowStr = p.split(',')[1];
                if (allowStr) {
                    var astrs = allowStr.split('|');
                    astrs.forEach(function(a) {
                        exObj.AllowOrdTypes.push(a);
                    });
                }
                exObj.RiskMode = parseInt(p.split(',')[2]);

                basic.Exchanges.push(exObj);
            });

            //产品信息
            basic.ProductFamilys = [];
            var pfStr = ans.Data[2];
            pfStr.forEach(function(p) {
                var pfObj = {
                    CurrencyCode: p.split(',')[0],
                    DispName: p.split(',')[1],
                    ExchCode: p.split(',')[2],
                    FutDisplayNum: parseInt(p.split(',')[3]),
                    FutureContractSize: parseFloat(p.split(',')[4]),
                    FutureTickSize: parseFloat(p.split(',')[5]),
                    MarketID: parseInt(p.split(',')[6]),
                    PFCode: p.split(',')[7],
                };
                basic.ProductFamilys.push(pfObj);
            });
        }
        $('#discussion').append('<li><strong>' + 'basic.Currencies:' + '</strong>&nbsp;&nbsp;' + JSON.stringify(basic.Currencies) + '</li>');
        $('#discussion').append('<li><strong>' + 'basic.Exchanges:' + '</strong>&nbsp;&nbsp;' + JSON.stringify(basic.Exchanges) + '</li>');
        $('#discussion').append('<li><strong>' + 'basic.ProductFamilys:' + '</strong>&nbsp;&nbsp;' + JSON.stringify(basic.ProductFamilys) + '</li>');
    }, function(err) {
        console.log(err)
    })
}
//获取合约数据(登录后)
function getContract() {
    // BD.logInfo
    get_data_wcf('/rmm/step3_contract', JSON.stringify(BD.logInfo), function(res) {
        console.log(res)
        $('#discussion').append('<li><strong>' + 'accInfo:' + '</strong>&nbsp;&nbsp;' + JSON.stringify(res.accInfo) + '</li>');
        $('#discussion').append('<li><strong>' + 'contracts:' + '</strong>&nbsp;&nbsp;' + JSON.stringify(res.contracts) + '</li>');
        $('#discussion').append('<li><strong>' + 'quotes:' + '</strong>&nbsp;&nbsp;' + JSON.stringify(res.quotes) + '</li>');
    }, function(err) {
        console.log(err)
    })
}
//获取资产数据
function getAsset() {
    get_data_wcf('/rmm/step4_asset', JSON.stringify(BD.logInfo), function(res) {
        console.log(res)
        $('#discussion').append('<li><strong>' + 'assert:' + '</strong>&nbsp;&nbsp;' + JSON.stringify(res.Data) + '</li>');
    }, function(err) {
        console.log(err)
    })
}
//获取帐户信息
function getAccount() {
    getLoginInfo();
    get_data_wcf('/rmm/step5_account', JSON.stringify(BD.logInfo), function(res) {
        console.log(res);
        $('#discussion').append('<li><strong>' + 'ConversionRate:' + '</strong>&nbsp;&nbsp;' + JSON.stringify(res.Data.ConversionRate) + '</li>');
        $('#discussion').append('<li><strong>' + 'DealedOrders:' + '</strong>&nbsp;&nbsp;' + JSON.stringify(res.Data.DealedOrders) + '</li>');
        $('#discussion').append('<li><strong>' + 'Orders:' + '</strong>&nbsp;&nbsp;' + JSON.stringify(res.Data.Orders) + '</li>');
        $('#discussion').append('<li><strong>' + 'Posions:' + '</strong>&nbsp;&nbsp;' + JSON.stringify(res.Data.Posions) + '</li>');
        $('#discussion').append('<li><strong>' + 'ProfitLoss:' + '</strong>&nbsp;&nbsp;' + JSON.stringify(res.Data.ProfitLoss) + '</li>');
    }, function(err) {
        console.log(err)
    })
}
//获取某个合约历史数据
function history() {
    var cti = { LoginName: '', ContractId: 1202 };
    console.log(JSON.stringify(cti))
    get_data_wcf('/rmm/subHistoryMinutesData',
        JSON.stringify(cti),
        function(res) {
            console.log(res);
            $('#discussion').append('<li><strong>' + 'history:' + '</strong>&nbsp;&nbsp;' + JSON.stringify(res) + '</li>');
        },
        function(err) {
            console.log(err)
        })
}