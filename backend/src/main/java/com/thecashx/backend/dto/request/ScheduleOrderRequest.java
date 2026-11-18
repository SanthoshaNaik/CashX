package com.thecashx.backend.dto.request;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class ScheduleOrderRequest {
    @NotBlank
    private String agentId;
    @NotNull
    private LocalDate scheduledDate;
    @NotBlank
    private String timeSlot;
    private String dispatchNotes;
}
