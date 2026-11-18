package com.thecashx.backend.service;

import com.thecashx.backend.dto.request.CalculateQuoteRequest;
import com.thecashx.backend.dto.response.PriceQuoteResponse;

public interface PricingService {
    PriceQuoteResponse calculateQuote(CalculateQuoteRequest request);
}
