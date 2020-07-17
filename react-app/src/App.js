/* eslint-disable no-unreachable */
import React, { useReducer } from "react"
import "./App.css"

const actions = {
  nameChanged: "NAME_CHANGED",
  emailChanged: "EMAIL_CHANGED",
  formSubmitted: "FORM_SUBMITTED",
}

const initialState = {
  name: "",
  email: "",
  nameError: null,
  emailError: null,
  submitAttemted: false,
  submitMessage: "",
  status: "clean",
}

function validate(name, value) {
  if (typeof value === "string") value = value.trim()
  switch (name) {
    case "name":
      if (value.length === 0) {
        return "Must Enter Name"
      } else if (value.split(" ").length < 2) {
        return "Must Enter First and Last name"
      } else {
        return null
      }
      break
    case "email":
      if (value.length === 0) {
        return "Must Enter Email"
      } else if (
        !value.includes("@") ||
        !value.includes(".") ||
        value.split(".")[1].length < 2
      ) {
        return "Must Enter Valid Email"
      } else {
        return null
      }
      break
    default:
      return name
  }
}

function formReducer(state, action) {
  let error
  switch (state.status) {
    case "dirty":
      // eslint-disable-next-line default-case
      switch (action.type) {
        case actions.formSubmitted:
          let formValid = true
          let nameError = validate("name", state.name)
          let emailError = validate("email", state.email)
          if (nameError || !state.name || emailError || !state.email) {
            formValid = false
          }
          return {
            ...state,
            nameError,
            emailError,
            submitAttemted: true,
            status: formValid ? "completed" : "dirty",
            submitMessage: formValid
              ? "Form Submitted Successfully"
              : "Form has Errors",
          }
      }
    // eslint-disable-next-line no-fallthrough
    case "clean":
      switch (action.type) {
        case actions.nameChanged:
          error = validate("name", action.payload)
          return {
            ...state,
            name: action.payload,
            nameError: error,
            submitMessage: "",
            status: "dirty",
          }
        case actions.emailChanged:
          error = validate("name", action.payload)
          return {
            ...state,
            email: action.payload,
            emailError: error,
            submitMessage: "",
            status: "dirty",
          }
        case actions.formSubmitted:
          return {
            ...state,
            submitMessage: "Please Fill out the form",
          }
        default:
          return state
      }
    case "completed":
    default:
      return state
  }
}

const Form = () => {
  const [state, dispatch] = useReducer(formReducer, initialState)

  const columnStyle = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  }

  const inputStyle = (hasError) => {
    return {
      outline: hasError && state.submitAttemted ? "2px solid red" : "none",
    }
  }

  const handleChange = (e) => {
    dispatch({
      type: actions[e.target.name + "Changed"],
      payload: e.target.value,
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    dispatch({ type: actions.formSubmitted })
  }
  
  return (
    <div className="App">
      <form onSubmit={handleSubmit}>
        <label style={columnStyle}>
          <span>Name:</span>
          <input
            style={inputStyle(state.nameError)}
            type="text"
            value={state.name}
            name="name"
            onChange={handleChange}
          />
          <span>{state.submitAttemted && state.nameError}</span>
        </label>
        <label style={columnStyle}>
          <span>Email:</span>
          <input
            style={inputStyle(state.emailError)}
            type="text"
            value={state.email}
            name="email"
            onChange={handleChange}
          />
          <span>{state.submitAttemted && state.emailError}</span>
        </label>
        <p>{state.submitAttemted && "Form Submitted Successfully!"}</p>
        <button type="submit">Submit</button>
        <pre>{JSON.stringify(state, null, 10)}</pre>
      </form>
    </div>
  )
}

export default Form
