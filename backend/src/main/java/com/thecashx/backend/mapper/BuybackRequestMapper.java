package com.thecashx.backend.mapper;

import com.thecashx.backend.dto.response.BuybackRequestResponse;
import com.thecashx.backend.entity.BuybackRequestEntity;

import java.util.ArrayList;
import java.util.stream.Collectors;

public class BuybackRequestMapper {
    public static BuybackRequestResponse mapToResponse(BuybackRequestEntity entity) {
        BuybackRequestResponse response = new BuybackRequestResponse();
        response.setId(entity.getId());
        response.setStatus(entity.getStatus());
        response.setScheduledDate(entity.getScheduledDate());
        response.setTimeSlot(entity.getTimeSlot());
        response.setDispatchNotes(entity.getDispatchNotes());
        response.setRequestDate(entity.getRequestDate() != null ? entity.getRequestDate().atStartOfDay() : null);
        response.setEstimatedPrice(entity.getEstimatedPrice());
        response.setFinalOfferPrice(entity.getFinalOfferPrice());
        response.setRemarks(entity.getRemarks());
        response.setCreatedAt(entity.getCreatedAt());

        if (entity.getCustomer() != null) {
            BuybackRequestResponse.CustomerDto customerDto = new BuybackRequestResponse.CustomerDto();
            customerDto.setId(entity.getCustomer().getId());
            customerDto.setName(entity.getCustomer().getFullName());
            customerDto.setPhone(entity.getCustomer().getPhone());
            customerDto.setAltPhone(entity.getCustomer().getAltPhone());
            customerDto.setEmail(entity.getCustomer().getEmail());
            customerDto.setAddress(entity.getCustomer().getAddress());
            customerDto.setCity(entity.getCustomer().getCity());
            customerDto.setPincode(entity.getCustomer().getPincode());
            response.setCustomer(customerDto);
        }

        if (entity.getRequestDevice() != null) {
            BuybackRequestResponse.DeviceDto deviceDto = new BuybackRequestResponse.DeviceDto();
            deviceDto.setDeviceType(entity.getRequestDevice().getDeviceType());
            deviceDto.setBrand(entity.getRequestDevice().getBrand());
            deviceDto.setModel(entity.getRequestDevice().getModel());
            deviceDto.setProcessor(entity.getRequestDevice().getProcessor());
            deviceDto.setRam(entity.getRequestDevice().getRam());
            deviceDto.setStorage(entity.getRequestDevice().getStorage());
            deviceDto.setCondition(entity.getRequestDevice().getCondition());
            deviceDto.setAge(entity.getRequestDevice().getAge());
            deviceDto.setAccessories(entity.getRequestDevice().getAccessories());
            deviceDto.setExpectedPrice(entity.getRequestDevice().getExpectedPrice());
            response.setDevice(deviceDto);
        }

        if (entity.getRequestInspection() != null) {
            BuybackRequestResponse.InspectionDto inspectionDto = new BuybackRequestResponse.InspectionDto();
            inspectionDto.setScreenCondition(entity.getRequestInspection().getScreenCondition());
            inspectionDto.setBodyCondition(entity.getRequestInspection().getBodyCondition());
            inspectionDto.setBatteryHealth(entity.getRequestInspection().getBatteryHealth());
            inspectionDto.setKeyboardStatus(entity.getRequestInspection().getKeyboardStatus());
            inspectionDto.setPortsStatus(entity.getRequestInspection().getPortsStatus());
            inspectionDto.setWifiBluetoothStatus(entity.getRequestInspection().getWifiBluetoothStatus());
            inspectionDto.setSoundMicStatus(entity.getRequestInspection().getSoundMicStatus());
            inspectionDto.setVerifiedAccessories(entity.getRequestInspection().getVerifiedAccessories());
            inspectionDto.setInspectedAt(entity.getRequestInspection().getInspectedAt());
            if (entity.getRequestInspection().getInspectedByAgent() != null) {
                inspectionDto.setInspectedByAgentName(entity.getRequestInspection().getInspectedByAgent().getName());
            }
            response.setInspection(inspectionDto);
        }

        if (entity.getAssignedAgent() != null) {
            BuybackRequestResponse.AgentSummaryDto agentDto = new BuybackRequestResponse.AgentSummaryDto();
            agentDto.setId(entity.getAssignedAgent().getId());
            agentDto.setName(entity.getAssignedAgent().getName());
            agentDto.setPhone(entity.getAssignedAgent().getPhone());
            agentDto.setCity(entity.getAssignedAgent().getCity());
            agentDto.setHub(entity.getAssignedAgent().getHub());
            response.setAssignedAgent(agentDto);
        }

        if (entity.getStatusHistory() != null) {
            response.setStatusHistory(entity.getStatusHistory().stream().map(history -> {
                BuybackRequestResponse.StatusHistoryDto historyDto = new BuybackRequestResponse.StatusHistoryDto();
                historyDto.setFromStatus(history.getFromStatus());
                historyDto.setToStatus(history.getToStatus());
                historyDto.setChangedByName(history.getChangedByName());
                historyDto.setReason(history.getReason());
                historyDto.setCreatedAt(history.getCreatedAt());
                return historyDto;
            }).collect(Collectors.toList()));
        } else {
            response.setStatusHistory(new ArrayList<>());
        }

        return response;
    }
}
