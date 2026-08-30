package com.sih.tourism.common.api;

public class ApiError {
    private String code;
    private String message;
    private String requestId;

    public ApiError(String code, String message, String requestId) {
        this.code = code;
        this.message = message;
        this.requestId = requestId;
    }

    public String getCode() { return code; }
    public String getMessage() { return message; }
    public String getRequestId() { return requestId; }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private String code;
        private String message;
        private String requestId;
        public Builder code(String code) { this.code = code; return this; }
        public Builder message(String message) { this.message = message; return this; }
        public Builder requestId(String requestId) { this.requestId = requestId; return this; }
        public ApiError build() { return new ApiError(code, message, requestId); }
    }
}
