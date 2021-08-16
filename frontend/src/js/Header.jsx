import React, { Component } from "react";
import Slider from './slider'
class Header extends Component {

    render() {
        return (
            <div>
                <nav className="navbar navbar-dark bg-dark">
                    <h1 className="navbar-brand ml-4">DATA Analyzer</h1>
                </nav>
                <Slider />
            </div>
        )
    }
}

export default Header;