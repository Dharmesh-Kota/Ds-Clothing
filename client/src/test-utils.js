import React from "react"
import configureStore from "redux-mock-store"
import { Provider } from "react-redux"
import { MemoryRouter } from "react-router-dom"
import { render } from "@testing-library/react"

const mockStore = configureStore([]);

export const renderWithProviders = (Component, initialState = {}, route = "/") => {
    const store = mockStore(initialState);

    return {
        store,
        ...render(      
            <Provider store={store}>
                <MemoryRouter initialEntries={[route]}>
                    {Component}
                </MemoryRouter>
            </Provider>
        )
    };
};