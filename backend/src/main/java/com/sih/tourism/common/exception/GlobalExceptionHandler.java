package com.sih.tourism.common.exception;

import com.sih.tourism.common.api.ApiError;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DataAccessResourceFailureException;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.UUID;

@RestControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger log = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    @ExceptionHandler(MethodArgumentNotValidException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ApiError handleValidationException(MethodArgumentNotValidException ex) {
        String message = ex.getBindingResult().getFieldErrors().stream()
                .map(err -> err.getField() + " " + err.getDefaultMessage())
                .findFirst()
                .orElse("Validation failed");
        return ApiError.builder()
                .code("INVALID_REQUEST")
                .message(message)
                .requestId(UUID.randomUUID().toString())
                .build();
    }

    @ExceptionHandler(IllegalArgumentException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ApiError handleIllegalArgumentException(IllegalArgumentException ex) {
        return ApiError.builder()
                .code("INVALID_REQUEST")
                .message(ex.getMessage())
                .requestId(UUID.randomUUID().toString())
                .build();
    }

    @ExceptionHandler(DataAccessResourceFailureException.class)
    @ResponseStatus(HttpStatus.SERVICE_UNAVAILABLE)
    public ApiError handleDatabaseUnavailable(DataAccessResourceFailureException ex) {
        log.error("Database connection unavailable", ex);
        return ApiError.builder()
                .code("DATABASE_UNAVAILABLE")
                .message("The database connection is temporarily unavailable. Please try again shortly.")
                .requestId(UUID.randomUUID().toString())
                .build();
    }

    @ExceptionHandler(Exception.class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    public ApiError handleAllExceptions(Exception ex) {
        log.error("Internal server error", ex);
        return ApiError.builder()
                .code("INTERNAL_SERVER_ERROR")
                .message("An unexpected error occurred")
                .requestId(UUID.randomUUID().toString())
                .build();
    }
}
