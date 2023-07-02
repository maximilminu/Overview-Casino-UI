import { ApiContext } from "@oc/api-context";
import { useContext } from "react";

const cache = {};

const useDescribe = ({ api, ID, preFixApi = "", apiVersion = 1, ttl = 90 }) => {
	const { Get } = useContext(ApiContext);

	return new Promise((resolve, reject) => {
		const url = `/${api}/v${apiVersion}${
			preFixApi ? `/${preFixApi}` : ""
		}/describe/${ID}`;

		if (!cache[url]) {
			const cacheItem = {
				callbacks: [],
				data: false,
				addCallback: (cb) => {
					cacheItem.callbacks.push(cb);
				},
				myTimeout: setTimeout(() => {
					delete cache[url];
				}, ttl * 1000),
			};
			cache[url] = cacheItem;

			Get(url)
				.then(({ data }) => {
					const c = cache[url];
					c.callbacks.forEach((cb) => cb(data));
					c.data = data;
				})
				.catch(reject);
		} else {
			if (cache[url].data) {
				resolve(cache[url].data);
			}
		}
		cache[url].addCallback(resolve);
	});
};

export default useDescribe;
