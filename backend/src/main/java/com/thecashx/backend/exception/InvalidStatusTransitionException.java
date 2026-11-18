package com.thecashx.backend.exception;

import lombok.Getter;

@Getter
public class InvalidStatusTransitionException extends RuntimeException {
    private final String fromStatus;
    private final String toStatus;

    public InvalidStatusTransitionException(String fromStatus, String toStatus) {
        super(String.format("Invalid status transition from %s to %s", fromStatus, toStatus));
        this.fromStatus = fromStatus;
        this.toStatus = toStatus;
    }
}
