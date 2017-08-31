var rmm = $.connection.rmm;
$.connection.hub.url = 'http://112.74.193.71:8069/signalr';
rmm.client.rtnQuotes = function(data) {
    console.log(data);
    $('#discussion').append('<li>' + data + '</li>');
};
//连接Hub
function hubStart() {
    $.connection.hub.qs = { "ticket": BD.ticket };
    $.connection.hub.start().done(function() {
        alert("hub 连接成功")
        console.log("hub 连接成功");
    }).fail(function() {
        alert("hub 连接失败")
    });
}
//断开Hub
function hubStop() {
    $.connection.hub.stop();
    alert("hub 已断开连接");
}
//订单状态
rmm.client.rtnModifyOrder = function(info) {
    //挂单状态
    if (info.Status == 1) {
        head = (info.OrderType == 1 ? "订单处理中" : "挂单已成功");
        console.log(head)
    }
    //订单成功
    else if (info.Status == 2) {
        head = "订单交易成功";
        console.log(head)
    }
    //订单失败
    else if (info.Status == 3) {
        head = "订单已拒绝:" + info.Note;
        console.log(head);
    } else if (info.Status == 4) {
        head = "订单取消成功"; // + info.Status;
        console.log(head);
    } else if (info.Status == 6) {
        if (info.OrderType == 1) {
            return;
        }
        head = "订单部分成交" + info.Status;
        console.log(head);
    } else if (info.Status == 8) {
        head = "订单等待中:"
        console.log(head);
    } else if (info.Status == 10) {
        head = "订单取消处理中";
        console.log(head);
    }
    console.log(info);
    $('#discussion').append('<li><strong>' + head + '</strong>&nbsp;&nbsp;' + JSON.stringify(info) + '</li>');
};
//订单已完成
rmm.client.rtnDealedOrder = function(info) {
    console.log(info);
};
//预订重复登录事件
rmm.client.rtnDuplicatedLogon = function(res) {
    console.log(res);
    if (res == 0) {
        alert('该用户在别处登录,请处理.')
    }
};
//订阅合约
function subContracts() {
    //客户端订阅那些合约 conId=0,表示订阅所有公共主力合约，conId=-1,表示不订阅所有合约,多个合约用‘，’隔开
    $('#discussion').append('<li>' + '订阅合约返回的数据从左至右依次代表1合约ID，2最新价，3现量，4买价，5买量，6卖价，7卖量，8总量，9最高，10最低，11开盘，12接收时间' + '</li>');
    rmm.server.subContracts(0);
}
//下单
function addOrder() {
    var order = {
        'AccountID': BD.AccID, // ,账户ID
        'ContractID': 1202, // , 合约ID
        'SecurityDesc': "NYM.CL.F.171000", // ,合约描述
        'Side': 1, //  //1-买，2-卖 头寸方向
        'OrderType': 1, //  //1-市价，2-限价，3-止损价，4-限价止损
        'OrderFlag': 0, //0-当日有效,1-一直有效
        'UserName': BD.userName, // 用户名,
        'Quantity': 1, // 下单数量
        'LimitPrice': "47.67", //  //限价
        'StopPrice': "0" //  //止损价
    };
    $.connection.hub.qs = { "ticket": BD.ticket };
    rmm.server.addOrder(order, BD.ticket).done(function(dd) {
        console.log('订单已提交');
    }).fail(function(ee) {
        alert('连接服务器错误，下单失败！');
    });
}
//止盈止损
function setPLPrice() {
    var braOrd = {
        AccountID: BD.AccID, // 账户ID,
        Side: 1, //头寸方向
        SecurityDesc: "NYM.CL.F.171000", //合约描述
        LMESettleDate: 0, //   LME结算日期
        ReferencePrice: 47.62, //头寸价格
        Quantity: 1, //数量
        Mode: 0, //止盈或止损
        ProfitPriceTicks: 47.88, //止盈价
        LossPriceTicks: 47.48, //止损价
        TrailingProfitLossTicks: 0, //跟踪点位
        UserName: BD.userName, //用户名,
        IsCanceled: false //是否取消
    };
    $.connection.hub.qs = { "ticket": BD.ticket };
    rmm.server.submitSetProfitLoss(braOrd, BD.ticket).done(function(dd) {
        alert('止盈止损已提交');;
    }).fail(function(ee) {
        alert('连接服务器错误，设置止盈止损设置失败！')
    });
}
//取消止盈止损
function cancelOrder() {
    var braOrd = {
        AccountID: BD.AccID, //账户ID,
        Side: 1, //头寸方向,
        SecurityDesc: "NYM.CL.F.171000", //合约描述,
        LMESettleDate: 0, //LME结算日期,
        IsCanceled: true //是否取消
    };
    $.connection.hub.qs = { "ticket": BD.ticket };
    rmm.server.submitSetProfitLoss(braOrd, BD.ticket).done(function(dd) {
        alert('取消止盈止损已提交');
    }).fail(function(ee) {
        alert('连接服务器错误，取消止盈止损设置失败！')
    });
}

function his() {
    alert('123');
    rmm.server.subHistoryMinutes(1202).done(function() {
        alert('历史数据')
    });
}

rmm.client.rtnHistoryMinutes = function(hms) {
    var start = new Date().getTime();
    console.log("hub:rmm.client.rtnHistoryMinutes");
    if (!hms.Data || hms.Data.length < 2) {
        return;
    }
    var elapsed2 = new Date().getTime() - start;
    console.log("rtnHistoryMinutes" + elapsed2);
    $timeout(function() {
        BD.upHistory(hms)
        var elapsed = new Date().getTime() - start;
        console.log("rtnHistoryMinutes--upHistory" + elapsed);
    });
    console.log("rtnHistoryMinutes_net:" + angular.toJson(hms).length);
};
rmm.client.rtnHistoryMinute = function(hms) {
    var start = new Date().getTime();
    console.log("hub:rmm.client.rtnHistoryMinute");
    if (!hms.Data) {
        return;
    }
    var elapsed2 = new Date().getTime() - start;
    console.log("rtnHistoryMinute" + elapsed2);
    $timeout(function() {
        BD.addHistory(hms);
        var elapsed = new Date().getTime() - start;
        console.log("rtnHistoryMinute--addHistory" + elapsed);

    });
    console.log("rtnHistoryMinute_net:" + angular.toJson(hms).length);
};