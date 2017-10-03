import './wrapper/_browser_dynamic'
import stateRouter from '../states'

stateRouter.evaluateCurrentRoute(window.__context.state || 'app.home', {id: 123})
