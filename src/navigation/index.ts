/**
 * this existence of this file is a sign I should switch to React or sth.
 * 
 * this is delightfully simple tho
 */

import styles from './styles.module.css';


const pages = {
    '/': 'Home',
    '/advanced/': 'Advanced',
    '/3d/': '3D'
}


const wrapper = document.createElement('nav');

wrapper.classList.add(styles.nav)

Object.entries(pages)
.forEach(
    ([path, label]) => {
        const anchor = document.createElement('a');
        
        if (path !== window.location.pathname) {
            anchor.setAttribute('href', path);
        }

        anchor.textContent = label;

        wrapper.append(anchor);
    }
);


document.body.append(wrapper);