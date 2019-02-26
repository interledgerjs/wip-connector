import 'mocha'
import * as sinon from 'sinon'
import * as Chai from 'chai'
import * as chaiAsPromised from 'chai-as-promised'
import Stats from '../../src/services/stats'
import Config from '../../src/services/config'
import AdminApi from '../../src/services/admin-api'
import axios from 'axios'
import { Alerts } from '../../src/middleware/business/alert';

Chai.use(chaiAsPromised)
const assert = Object.assign(Chai.assert, sinon.assert)
describe('Admin Api', function () {

  let adminApi: AdminApi
  let alerts: Alerts
  let stats: Stats
  let config: Config

  beforeEach(function () {
    config = new Config()
    alerts = new Alerts()
    stats = new Stats()
    config.loadFromOpts({
      env: "test",
      accounts: {
        'cad-ledger': {
          relation: 'peer',
          assetCode: 'CAD',
          assetScale: 4,
          endpoint: 'mock-ilp-endpoint',
          options: {}
        }
      },
      adminApi: true
    })
    adminApi = new AdminApi({stats, config, alerts})
    adminApi.listen()
  })

  afterEach(function () {
    adminApi.shutdown()
  })

  it('starts an http server if admin api is true in config', async function (){
    try{
      const response = await axios.get('http://127.0.0.1:7780/health')
      assert.equal(response.data, "Status: ok")
      return
    }
    catch  (error) {}
    assert.fail('Could not connect to admin api server')
  })

  it('returns 404 for unknown route', async function () {
    try{
      const response = await axios.get('http://127.0.0.1:7780/unknownRoute')
    }
    catch  (error) {
      assert.equal(error.response.status, 404)
      return
    }
    assert.fail('Did not throw a 404 for an unknown route')
  })

  describe('getStats', function () {
    it('returns the collected stats', async function () {

      try{
        const response = await axios.get('http://127.0.0.1:7780/stats')
        const metrics = response.data
        const expected = [{
          help: 'Total number of incoming ILP packets',
          name: 'ilp_connector_incoming_ilp_packets',
          type: 'counter',
          values: [],
          aggregator: 'sum'
        },
        {
          help: 'Total value of incoming ILP packets',
          name: 'ilp_connector_incoming_ilp_packet_value',
          type: 'counter',
          values: [],
          aggregator: 'sum'
        },
        {
          help: 'Total number of outgoing ILP packets',
          name: 'ilp_connector_outgoing_ilp_packets',
          type: 'counter',
          values: [],
          aggregator: 'sum'
        },
        {
          help: 'Total value of outgoing ILP packets',
          name: 'ilp_connector_outgoing_ilp_packet_value',
          type: 'counter',
          values: [],
          aggregator: 'sum'
        },
        {
          help: 'Total of incoming money',
          name: 'ilp_connector_incoming_money',
          type: 'gauge',
          values: [],
          aggregator: 'sum'
        },
        {
          help: 'Total of outgoing money',
          name: 'ilp_connector_outgoing_money',
          type: 'gauge',
          values: [],
          aggregator: 'sum'
        },
        {
          help: 'Total of rate limited ILP packets',
          name: 'ilp_connector_rate_limited_ilp_packets',
          type: 'counter',
          values: [],
          aggregator: 'sum'
        },
        {
          help: 'Total of rate limited money requests',
          name: 'ilp_connector_rate_limited_money',
          type: 'counter',
          values: [],
          aggregator: 'sum'
        },
        {
          help: 'Balances on peer account',
          name: 'ilp_connector_balance',
          type: 'gauge',
          values: [],
          aggregator: 'sum'
        }]

        assert.deepEqual(metrics, expected)
        return
      } catch (error) {}
      assert.fail('Could not get metrics')
    })
  })

  describe('getAlerts', function () {
    it('returns no alerts by default', async function () {
      const response = await axios.get('http://127.0.0.1:7780/alerts')
      assert.deepEqual(response.data, {alerts: []})
    })

    it('returns an alert when a peer returns "maximum balance exceeded"') // TODO: complete when balance middleware is added
  })
})