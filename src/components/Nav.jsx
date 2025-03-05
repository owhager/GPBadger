import React from 'react';

export default function Nav() {
    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light mb-4">
            <div className="container-fluid">
                <a className="navbar-brand" href="index.html">Grade Search</a>
                <div className="collapse navbar-collapse">
                    <ul className="navbar-nav">
                        <li className="nav-item">
                            <a
                                className="nav-link"
                                href="userpage.html"
                                style={{ fontWeight: 500 }}
                            >
                                Login
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
}