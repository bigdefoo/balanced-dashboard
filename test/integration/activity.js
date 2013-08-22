module('Activity', {
    setup: function () {
        Testing.selectMarketplaceByName();

        // click the activity link
        $('#marketplace-nav .activity a').click();
    }, teardown: function () {
        Ember.run(function () {
            $('#add-funds').modal('hide');
            $('#withdraw-funds').modal('hide');
            $('#download-confirm').modal('hide');
        });
    }
});

test('can visit page', function (assert) {

    var $title = $('#content h1');

    assert.notEqual($title.text().indexOf('Activity'), -1,
        'Title is incorrect');

    assert.ok($('#activity .download').length, "Download link is visible");
});

test('can visit pages', function (assert) {
    var links = [
        ['Cards & Bank Accounts', 'funding-instruments'],
        ['Customers', 'accounts'],
        ['Transactions', 'transactions']
    ];
    expect(links.length * 2);
    _.each(links, function (linkAndClass) {
        var link = linkAndClass[0],
            cls = linkAndClass[1];
        var $link = $('#activity a:contains("' + link + '")');
        assert.ok($link.length, link + ' link exists');
        $link.click();
        assert.ok($('#activity table.items.' + cls).length, link + ' table visible');
    });
});

test('pages have download links', function (assert) {
    var links = [
        ['Cards & Bank Accounts', false],
        ['Customers', false],
        ['Transactions', true]
    ];
    expect(links.length * 2);
    _.each(links, function (linkAndHasDownload) {
        var link = linkAndHasDownload[0],
            hasDownload = linkAndHasDownload[1];
        var $link = $('#activity a:contains("' + link + '")');
        assert.ok($link.length, link + ' link exists');
        $link.click();

        assert.equal($("#activity .download").length, hasDownload ? 1 : 0);
    });
});

test('Click load more shows 5 more and hides load more', function (assert) {
    assert.equal($('#activity .results table.transactions tfoot td').length, 1, 'has "load more"');

    $('#activity .results table.transactions tfoot td.load-more-results a').click();

    assert.equal($('#activity .results table.transactions tbody tr').length, 15, 'has 15 transactions');
    assert.equal($('#activity .results table.transactions tfoot td').length, 0, 'does not have "load more"');
});

test('Filtering by type works', function (assert) {
    assert.equal($('#activity .results table.transactions tbody tr').length, 10, 'has 10 transactions before');

    $('#activity .results header .transactions .selector a.dropdown-toggle').click();

    $('#activity .results header .transactions .selector a:contains("Credits")').click();

    assert.equal($('#activity .results table.transactions tbody tr').length, 1, 'has 1 transactions after');
});

test('add funds', function (assert) {
    assert.notEqual($('.activity-escrow-box .amount .number1d').html().indexOf('1,137.81'), -1, 'escrow amount is $1,137.81');

    $('.activity-escrow-box .btn').first().click();

    assert.equal($('#add-funds').css('display'), 'block', 'add funds modal visible');

    assert.equal($('#add-funds select option').length, 2);

    $('#add-funds input').first().val('55.55').trigger('keyup');
    $('#add-funds .modal-footer .btn').not('.danger').click();

    assert.equal($('#add-funds').css('display'), 'none', 'add funds modal hidden');

    //assert.notEqual($('.activity-escrow-box .amount .number1d').html().indexOf('1,193.36'), -1, 'escrow amount is now $1,193.36');
});

test('add funds only adds once despite multiple clicks', function (assert) {
    var stub = sinon.stub(Balanced.Adapter, "create");

    $('.activity-escrow-box .btn').first().click();

    $('#add-funds input').first().val('55.55').trigger('keyup');
    for (var i = 0; i < 20; i++) {
        $('#add-funds .modal-footer button[name="modal-submit"]').click();
    }

    assert.ok(stub.calledOnce);
});

test('withdraw funds', function (assert) {
    assert.notEqual($('.activity-escrow-box .amount .number1d').html().indexOf('1,137.81'), -1, 'escrow amount is $1,137.81');

    $('.activity-escrow-box .btn').eq(1).click();

    assert.equal($('#withdraw-funds').css('display'), 'block', 'withdraw funds modal visible');

    assert.equal($('#withdraw-funds select option').length, 4, 'bank accounts in account dropdown');

    $('#withdraw-funds input').first().val('55.55').trigger('keyup');
    $('#withdraw-funds .modal-footer .btn').not('.danger').click();

    assert.equal($('#withdraw-funds').css('display'), 'none', 'withdraw funds modal hidden');

    //assert.notEqual($('.activity-escrow-box .amount .number1d').html().indexOf('1,082.26'), -1, 'escrow amount is now $1,082.26');
});

test('withdraw funds only withdraws once despite multiple clicks', function (assert) {
    var stub = sinon.stub(Balanced.Adapter, "create");

    $('.activity-escrow-box .btn').eq(1).click();
    $('#withdraw-funds input').first().val('55.55').trigger('keyup');

    for (var i = 0; i < 20; i++) {
        $('#withdraw-funds .modal-footer button[name="modal-submit"]').click();
    }

    assert.ok(stub.calledOnce);
});

test('download activity', function (assert) {
    var stub = sinon.stub(Balanced.Adapter, "create");

    $("#activity .icon-download").click();

    $("#download-confirm form input[name='email']").val('test@example.com').trigger('keyup');
    $('#download-confirm .modal-footer button[name="modal-submit"]').click();

    assert.ok(stub.calledOnce);
});

test('download activity only runs once despite multiple clicks', function (assert) {
    var stub = sinon.stub(Balanced.Adapter, "create");

    $("#activity .icon-download").click();

    $("#download-confirm form input[name='email']").val('test@example.com').trigger('keyup');
    for (var i = 0; i < 20; i++) {
        $('#download-confirm .modal-footer button[name="modal-submit"]').click();
    }

    assert.ok(stub.calledOnce);
});
