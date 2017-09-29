import Wrapper from './wrapper'

const wrapper = new Wrapper({
    target: document.body,
    data: {
        src: 'basic/deep',
        name: 'Banana'
    }
})

document.addEventListener('click', ()=>{
    wrapper.teardown()
})
