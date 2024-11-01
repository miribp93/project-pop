package com.guaguaupop.guaguaupop.service;

import org.apache.http.client.methods.HttpGet;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.util.EntityUtils;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.stereotype.Service;

import java.io.IOException;

@Service
public class OpenStreetMapService {
    private static final String NOMINATIM_URL = "https://nominatim.openstreetmap.org/search?q=%s&format=json&addressdetails=1";

    public String getAddress(String address) throws IOException {
        String url = String.format(NOMINATIM_URL, address);
        CloseableHttpClient client = HttpClients.createDefault();
        HttpGet request = new HttpGet(url);
        String response = EntityUtils.toString(client.execute(request).getEntity());

        JSONArray jsonArray = new JSONArray(response);
        if (jsonArray.length() > 0) {
            JSONObject jsonObject = jsonArray.getJSONObject(0);
            return jsonObject.getString("display_name");
        } else {
            throw new IOException("No se han encontrado resultados: " + address);
        }
    }
}
