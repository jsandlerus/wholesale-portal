import { fetchUtils } from "react-admin";
import { stringify } from "query-string";

const apiUrl = "http://localhost:5000";
const httpClient = fetchUtils.fetchJson;

export default {
  getList: (resource, params) => {
    console.log("getList resource", resource);

    const { page, perPage } = params.pagination;
    const { field, order } = params.sort;
    console.log("params", page, perPage, field, order, params.filter);

    const query = {
      sort: JSON.stringify([field, order]),
      range: JSON.stringify([(page - 1) * perPage, page * perPage - 1]),
      filter: JSON.stringify(params.filter),
    };
    const url = `${apiUrl}/${resource}?${stringify(query)}`;
    console.log("query", query);
    console.log("url", url);
    return httpClient(url).then(({ headers, json }) => {
      console.log("headers", headers);
      return {
        data: json,
        total: parseInt(headers.get("content-range").split("/").pop(), 10),
      };
    });
  },

  getOne: (resource, params) => {
    console.log("getOne resource", resource);

    httpClient(`${apiUrl}/${resource}/${params.id}`).then(({ json }) => ({
      data: json,
    }));
  },

  getMany: (resource, params) => {
    console.log("getMany");
    const query = {
      filter: JSON.stringify({ id: params.ids }),
    };
    const url = `${apiUrl}/${resource}?${stringify(query)}`;
    return httpClient(url).then(({ json }) => ({ data: json }));
  },

  getManyReference: (resource, params) => {
    console.log("getManyReference");

    const { page, perPage } = params.pagination;
    const { field, order } = params.sort;
    const query = {
      sort: JSON.stringify([field, order]),
      range: JSON.stringify([(page - 1) * perPage, page * perPage - 1]),
      filter: JSON.stringify({
        ...params.filter,
        [params.target]: params.id,
      }),
    };
    const url = `${apiUrl}/${resource}?${stringify(query)}`;

    return httpClient(url).then(({ headers, json }) => ({
      data: json,
      total: parseInt(headers.get("content-range").split("/").pop(), 10),
    }));
  },

  update: (resource, params) => {
    console.log("update");

    httpClient(`${apiUrl}/${resource}/${params.id}`, {
      method: "PUT",
      body: JSON.stringify(params.data),
    }).then(({ json }) => ({ data: json }));
  },

  updateMany: (resource, params) => {
    console.log("updateMany");

    const query = {
      filter: JSON.stringify({ id: params.ids }),
    };
    return httpClient(`${apiUrl}/${resource}?${stringify(query)}`, {
      method: "PUT",
      body: JSON.stringify(params.data),
    }).then(({ json }) => ({ data: json }));
  },

  create: (resource, params) => {
    console.log("create");

    httpClient(`${apiUrl}/${resource}`, {
      method: "POST",
      body: JSON.stringify(params.data),
    }).then(({ json }) => ({
      data: { ...params.data, id: json.id },
    }));
  },

  delete: (resource, params) => {
    console.log("delete");

    httpClient(`${apiUrl}/${resource}/${params.id}`, {
      method: "DELETE",
    }).then(({ json }) => ({ data: json }));
  },

  deleteMany: (resource, params) => {
    console.log("deleteMany");

    const query = {
      filter: JSON.stringify({ id: params.ids }),
    };
    return httpClient(`${apiUrl}/${resource}?${stringify(query)}`, {
      method: "DELETE",
      body: JSON.stringify(params.data),
    }).then(({ json }) => ({ data: json }));
  },
};
