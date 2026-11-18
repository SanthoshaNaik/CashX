package com.thecashx.backend.service.impl;

import com.thecashx.backend.dto.request.CalculateQuoteRequest;
import com.thecashx.backend.dto.response.PriceQuoteResponse;
import com.thecashx.backend.entity.PricingBaseRateEntity;
import com.thecashx.backend.repository.PricingBaseRateRepository;
import com.thecashx.backend.service.PricingService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class PricingServiceImpl implements PricingService {

    private final PricingBaseRateRepository pricingBaseRateRepository;

    @Override
    public PriceQuoteResponse calculateQuote(CalculateQuoteRequest request) {
        double base = 25000.0;
        String devType = request.getDeviceType() != null ? request.getDeviceType().toLowerCase() : "laptop";
        
        String processor = request.getProcessor() != null ? request.getProcessor() : "";
        String ram = request.getRam() != null ? request.getRam() : "";
        String storage = request.getStorage() != null ? request.getStorage() : "";
        String model = request.getModel() != null ? request.getModel() : "";
        String brand = request.getBrand() != null ? request.getBrand() : "";

        if ("monitor".equals(devType)) {
            base = 12000;
            if (processor.contains("4K") || processor.contains("OLED") || processor.contains("UltraWide") || model.contains("4K")) {
                base = 22000;
            } else if (processor.contains("2K") || processor.contains("1440p")) {
                base = 16000;
            }
            if (ram.contains("165Hz") || ram.contains("240Hz")) {
                base += 4000;
            }
        } else if ("macmini".equals(devType) || "mac mini".equals(devType)) {
            Optional<PricingBaseRateEntity> baseRate = pricingBaseRateRepository.findByCategoryAndBrandAndModelAndActiveTrue("MacMini", "Apple", model);
            if (baseRate.isPresent()) {
                base = baseRate.get().getBasePrice().doubleValue();
            } else {
                base = 42000;
            }
            if (ram.contains("16GB") || ram.contains("24GB")) {
                base += 6000;
            } else if (ram.contains("32GB") || ram.contains("64GB")) {
                base += 14000;
            }
            if (storage.contains("1TB") || storage.contains("2TB")) {
                base += 8000;
            }
        } else if ("desktop".equals(devType)) {
            base = 32000;
            if (processor.contains("Ryzen 7") || processor.contains("i7")) {
                base = 42000;
            } else if (processor.contains("Ryzen 9") || processor.contains("i9")) {
                base = 58000;
            }
            if (ram.contains("32GB") || ram.contains("64GB")) {
                base += 6000;
            }
        } else {
            Optional<PricingBaseRateEntity> baseRate = pricingBaseRateRepository.findByCategoryAndBrandAndActiveTrue("Laptop", brand);
            if (baseRate.isPresent()) {
                base = baseRate.get().getBasePrice().doubleValue();
            }

            double cpuMult = 1.0;
            if (processor.contains("i7") || processor.contains("Ryzen 7") || processor.contains("M1 Pro") || processor.contains("M2")) {
                cpuMult = 1.35;
            } else if (processor.contains("i9") || processor.contains("Ryzen 9") || processor.contains("M1 Max") || processor.contains("M3") || processor.contains("M4")) {
                cpuMult = 1.6;
            } else if (processor.contains("i3") || processor.contains("Ryzen 3") || processor.contains("Celeron")) {
                cpuMult = 0.75;
            }
            base = Math.round(base * cpuMult);

            if (ram.contains("16GB") || ram.contains("24GB")) {
                base += 4000;
            } else if (ram.contains("32GB") || ram.contains("64GB")) {
                base += 9000;
            }
            if (storage.contains("1TB") || storage.contains("2TB")) {
                base += 4000;
            }
        }

        String condition = request.getCondition() != null ? request.getCondition() : "Good";
        double condMult = 1.0;
        if ("Excellent".equals(condition)) condMult = 1.1;
        else if ("Good".equals(condition)) condMult = 1.0;
        else if ("Average".equals(condition)) condMult = 0.85;
        else if ("Damaged".equals(condition)) condMult = 0.55;

        String age = request.getAge();
        double ageMult = 1.0;
        if (age != null) {
            if (age.contains("Under 1 Year")) ageMult = 1.2;
            else if (age.contains("1-2 Years")) ageMult = 1.0;
            else if (age.contains("2-4 Years")) ageMult = 0.8;
            else if (age.contains("Over 4 Years")) ageMult = 0.6;
        }

        double calculated = Math.round(base * condMult * ageMult);

        String screenCondition = request.getScreenCondition();
        if ("Minor Scratches".equals(screenCondition)) calculated -= 1200;
        else if ("Spots / Bleeding / Lines".equals(screenCondition)) calculated -= 4000;
        else if ("Cracked / Broken Glass".equals(screenCondition)) calculated -= 7500;

        String batteryHealth = request.getBatteryHealth();
        if (batteryHealth != null) {
            if (batteryHealth.contains("Fair") || batteryHealth.contains("70-79%")) calculated -= 1500;
            else if (batteryHealth.contains("Degraded") || batteryHealth.contains("Service") || batteryHealth.contains("Below 70%")) calculated -= 3200;
            else if (batteryHealth.contains("Not Holding Charge")) calculated -= 4500;
        }

        if ("Some Faulty Keys".equals(request.getKeyboardStatus())) calculated -= 1600;
        if ("Issues / Not Working".equals(request.getPortsStatus())) calculated -= 1200;

        List<String> accessories = request.getAccessories();
        if (accessories != null) {
            boolean hasCharger = accessories.stream().anyMatch(a -> a.contains("Charger") || a.contains("Original Charger"));
            boolean hasBox = accessories.stream().anyMatch(a -> a.contains("Box") || a.contains("Original Box"));
            boolean hasInvoice = accessories.stream().anyMatch(a -> a.contains("Invoice") || a.contains("Original Bill") || a.contains("Bill"));
            boolean hasWarranty = accessories.stream().anyMatch(a -> a.contains("Warranty") || a.contains("Valid Warranty"));

            if (hasCharger) calculated += 1000;
            if (hasBox) calculated += 600;
            if (hasInvoice) calculated += 1200;
            if (hasWarranty) calculated += 1800;
        }

        double finalAmount = Math.max(3000, calculated);

        return PriceQuoteResponse.builder()
                .estimatedPrice(BigDecimal.valueOf(finalAmount))
                .build();
    }
}
