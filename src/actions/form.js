import _ from "lodash";
import regApi from "../apis/registration";
import { FORM_GET } from "../reducers/regForm";

export const createForm = (
  { eventId, formCategoryId, formData },
  callback
) => async () => {
  try {
    const response = await regApi().post(
      `/events/${eventId}/formCategories/${formCategoryId}/forms`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" }
      }
    );
    if (callback) callback(null, response.data);
  } catch (error) {
    console.log({ error });
    if (callback) callback(error);
  }
};

export const getFormById = (formId, callback) => async dispatch => {
  try {
    dispatch({
      type: FORM_GET,
      payload: { form: {} }
    });
    const response = await regApi().get(`/forms/${formId}`);
    dispatch({
      type: FORM_GET,
      payload: { form: response.data }
    });
    if (callback) callback(null, response.data);
  } catch (error) {
    console.log({ error });
    if (callback) callback(error);
  }
};

export const updateFormById = (
  formId,
  formData,
  callback
) => async dispatch => {
  try {
    const response = await regApi().put(`/forms/${formId}`, formData, {
      headers: { "Content-Type": "multipart/form-data" }
    });
    dispatch({
      type: FORM_GET,
      payload: { form: response.data }
    });
    if (callback) callback(null, response.data);
  } catch (error) {
    console.log({ error });
    if (callback) callback(error);
  }
};

export const updatePaymentReceiptById = (
  formId,
  formData,
  callback
) => async dispatch => {
  try {
    const response = await regApi().put(
      `/forms/${formId}/paymentReceipt`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" }
      }
    );
    dispatch({
      type: FORM_GET,
      payload: { form: response.data }
    });
    if (callback) callback(null, response.data);
  } catch (error) {
    console.log({ error });
    if (callback) callback(error);
  }
};

export const checkPinSet = (formId, callback) => async () => {
  try {
    const response = await regApi().get(`/forms/${formId}/pin/set`);
    if (callback) callback(null, response.data);
  } catch (error) {
    console.log({ error });
    if (callback) callback(error);
  }
};

export const checkPinValid = (formId, params, callback) => async () => {
  console.log(params);
  try {
    const response = await regApi().post(
      `/forms/${formId}/pin/valid`,
      _.pick(params, ["pin"])
    );
    if (callback) callback(null, response.data);
  } catch (error) {
    console.log({ error });
    if (callback) callback(error);
  }
};

export const checkPinToken = (formId, token, callback) => async () => {
  try {
    await regApi().post(`/forms/${formId}/pin/checkResetToken`, { token });
    if (callback) callback();
  } catch (error) {
    if (callback) callback(error);
  }
};

export const requestResetPin = (formId, callback) => async () => {
  try {
    await regApi().post(`/forms/${formId}/pin/sendForgetEmail`);
    if (callback) callback();
  } catch (error) {
    if (callback) callback(error);
  }
};

export const updatePin = (formId, pin, token, callback) => async dispatch => {
  try {
    await regApi().put(`/forms/${formId}/pin`, { token, pin });
    if (callback) callback();
  } catch (error) {
    console.log(error);
    if (callback) callback(error);
  }
};

export const createPin = (formId, pin, callback) => async () => {
  try {
    const response = await regApi().post(`/forms/${formId}/pin`, { pin });
    if (callback) callback(null, response.data);
  } catch (error) {
    console.log({ error });
    if (callback) callback(error);
  }
};
