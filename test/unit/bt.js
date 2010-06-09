/*
 * Copyright(c) 2010 BitTorrent Inc.
 *
 * Date: %date%
 * Version: %version%
 *
 */

module('bt');

test('bt.add.torrent', function() {
  expect(9);

  var url = 'http://example.com/add.torrent';
  var url_nocb = 'http://example.com/cb.torrent';
  var url_def = 'http://example.com/def.torrent';
  var url_cbdef = 'http://example.com/cbdef.torrent';
  var defs = { label: 'foobar',
               name: 'foobar' };
  // Just in case.
  bt.events.set('torrent', bt._handlers.torrent);
  stop();
  bt.add.torrent(url_nocb);
  bt.add.torrent(url_def, defs);
  bt.add.torrent(url, function(resp) {
    equals(resp.url, url, 'Url\'s set right');
    equals(resp.status, 200, 'Status is okay');
    equals(resp.message, 'success', 'Message is okay');
    var download_urls = _.map(bt.torrent.all(), function(v) {
      return v.properties.get('download_url');
    });
    ok(download_urls.indexOf(url) >= 0, 'Torrent added successfully');

    ok(download_urls.indexOf(url_nocb) >= 0, 'No cb or defaults added okay');
    var tor = bt.torrent.get(url_def);
    _.each(defs, function(v, k) {
      equals(tor.properties.get(k), v, 'Defaults are set');
    });
    bt.add.torrent(url_cbdef, defs, function(resp) {
      var tor = bt.torrent.get(url_cbdef);
      _.each(defs, function(v, k) {
        equals(tor.properties.get(k), v, 'Callback + defaults works');
      });
      start();
    });
  });
});

test('bt.stash', function() {
  expect(8);

  var objs = { foo: 'bar',
              bar: [1, 2, '3'],
              baz: { a: 1 }
            };
  _.each(objs, function(v, k) {
    bt.stash.set(k, v);
    same(bt.stash.get(k), v, 'Parsing works');
    equals(stub.stash.get(k), JSON.stringify(v), 'Serialization works');
  });
  same(bt.stash.keys(), _.keys(objs), 'keys() works');
  same(bt.stash.all(), objs, 'all() works');
});

test('bt.events', function() {
  expect(3);

  var fn = function() { };
  bt.events.set('torrent', fn);
  same(bt.events.get('torrent'), fn, 'Callback set correctly');
  ok(bt.events.keys().indexOf('torrent') >= 0, 'Torrent shows up in the keys');
  same(bt.events.all()['torrent'], fn, 'All is returning the right data');
});

test('bt.torrent', function() {
  expect(4);

  var url = 'http://example.com/add.torrent';
  var tor = bt.torrent.get(url);
  equals(tor.properties.get('download_url'), url, 'Got the right torrent');
  equals(bt.torrent.get(tor.hash).properties.get('hash'), tor.hash,
         'Can get by hash too');
  ok(bt.torrent.keys().indexOf(tor.hash) >= 0, 'Keys has the right hashes');
  same(bt.torrent.all()[tor.hash], tor, 'all() has at least one right key');
});

test('bt.resource', function() {
  expect(1);

  var txt = 'test123\n';
  equal(bt.resource('data/foobar'), txt, 'Fetched the right data');
});