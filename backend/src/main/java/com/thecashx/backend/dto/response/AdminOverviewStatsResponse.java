package com.thecashx.backend.dto.response;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.util.Map;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class AdminOverviewStatsResponse {
    private long totalRequests;
    private long newRequests;
    private long scheduledPickups;
    private long completed;
    private long cancelled;
    private long totalAgents;
    private long activeAgents;
    private BigDecimal totalEstimatedValue;
    private Map<String, Long> categoryDistribution;
}
