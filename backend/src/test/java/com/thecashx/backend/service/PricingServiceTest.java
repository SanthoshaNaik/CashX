package com.thecashx.backend.service;

import com.thecashx.backend.dto.request.CalculateQuoteRequest;
import com.thecashx.backend.dto.response.PriceQuoteResponse;
import com.thecashx.backend.entity.PricingBaseRateEntity;
import com.thecashx.backend.repository.PricingBaseRateRepository;
import com.thecashx.backend.service.impl.PricingServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class PricingServiceTest {

    @Mock
    private PricingBaseRateRepository pricingBaseRateRepository;

    @InjectMocks
    private PricingServiceImpl pricingService;

    @BeforeEach
    void setUp() {
        PricingBaseRateEntity macbookRate = PricingBaseRateEntity.builder()
                .category("Laptop")
                .brand("Apple MacBook")
                .basePrice(new BigDecimal("45000"))
                .active(true)
                .build();

        when(pricingBaseRateRepository.findByCategoryAndBrandAndActiveTrue(eq("Laptop"), eq("Apple MacBook")))
                .thenReturn(Optional.of(macbookRate));
    }

    @Test
    void testCalculateQuote_MacBookPro_Excellent() {
        CalculateQuoteRequest request = CalculateQuoteRequest.builder()
                .deviceType("Laptop")
                .brand("Apple MacBook")
                .model("MacBook Pro 14")
                .processor("M1 Pro")
                .ram("16GB")
                .storage("512GB SSD")
                .condition("Excellent")
                .age("Under 1 Year")
                .accessories(List.of("Charger", "Box", "Bill"))
                .build();

        PriceQuoteResponse response = pricingService.calculateQuote(request);

        assertNotNull(response);
        assertNotNull(response.getEstimatedPrice());
        assertTrue(response.getEstimatedPrice().compareTo(new BigDecimal("3000")) > 0);
        assertTrue(response.getEstimatedPrice().compareTo(new BigDecimal("50000")) > 0);
    }

    @Test
    void testCalculateQuote_MinimumFloorPrice() {
        CalculateQuoteRequest request = CalculateQuoteRequest.builder()
                .deviceType("Laptop")
                .brand("Apple MacBook")
                .model("Old Broken")
                .processor("Celeron")
                .condition("Damaged")
                .age("Over 4 Years")
                .screenCondition("Cracked / Broken Glass")
                .batteryHealth("Not Holding Charge")
                .keyboardStatus("Some Faulty Keys")
                .portsStatus("Issues / Not Working")
                .build();

        PriceQuoteResponse response = pricingService.calculateQuote(request);

        assertNotNull(response);
        assertEquals(0, response.getEstimatedPrice().compareTo(new BigDecimal("3000")));
    }
}
