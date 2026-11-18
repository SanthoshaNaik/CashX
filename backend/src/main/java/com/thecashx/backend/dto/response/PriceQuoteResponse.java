package com.thecashx.backend.dto.response;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.util.Map;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class PriceQuoteResponse {
    private BigDecimal estimatedPrice;
    private Map<String, Object> breakdown;
}
