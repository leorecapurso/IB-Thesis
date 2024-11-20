
# Calculate d′ with hit rate and false alarm rate as input 
# Sigma is an optional parameter specifying the SD of the noise distribution
dprime <- function(h, fa, sigma=1) { 
  ((1 + sigma^2)/2)^(-1/2) * (sigma * qnorm(h) - qnorm(fa))
}


# Calculate d′ (2afc tasks) with hit rate and false alarm rate as input 
# Sigma is an optional parameter specifying the SD of the noise distribution
dprime_2afc <- function(h, fa, sigma=1) { 
  ((1 + sigma^2)/2)^(-1/2) * (1/sqrt(2)) * (sigma * qnorm(h) - qnorm(fa))
}


# Calculate criterion with hit rate and false alarm rate as input 
# Sigma is an optional parameter specifying the SD of the noise distribution
criterion <- function(h, fa, sigma=1) {
  ((1 + sigma^2)/2)^(-1/2) * (-sigma / (1 + sigma)) * (qnorm(h) + qnorm(fa))
}


# Approximate the variance for the distribution of each d′ point estimate, 
# and then construct confidence intervals using that estimated variance 
# The below comes from Macmillan & Creelman (2001), see also Kaldec (1999)
estimate_variance <- function(h, fa, nPresent, nAbsent, alpha) {
  dPrime <<- qnorm(h) - qnorm(fa)
  # Calculate phi for hit and false alarm rates (pp. 325, eq. 13.5)
  phi_hit <- 1/sqrt(2*pi)*exp(1)^(-0.5*qnorm(h)^2)
  phi_fa <- 1/sqrt(2*pi)*exp(1)^(-0.5*qnorm(fa)^2)
  # Find variance of d' (pp. 325, eq. 13.4)
  var_dPrime <- (h*(1-h))/(nPresent*(phi_hit^2)) + (fa*(1-fa)/(nAbsent*(phi_fa)^2))
  # Find confidence interval around d′
  se_dPrime <<- var_dPrime^0.5
  lower_CI_dPrime <<- (qnorm(h)-qnorm(fa)) - se_dPrime * qnorm(alpha/2, lower.tail=FALSE)
  upper_CI_dPrime <<- (qnorm(h)-qnorm(fa)) + se_dPrime * qnorm(alpha/2, lower.tail=FALSE)
  mylist <- list("SE_dPrime"=se_dPrime, "upper_CI_dPrime"=upper_CI_dPrime, "lower_CI_dPrime"=lower_CI_dPrime)
  return(mylist) 
}


# Estimate the variance and construct confidence intervals for a 2afc d′ estimate 
# Macmillan & Creelman (2005) pgs. 328-329
estimate_variance_2afc <- function(h, fa, nPresent, nAbsent, alpha) {
  dPrime_2afc <<- (1/sqrt(2))*(qnorm(h) - qnorm(fa))
  # Calculate phi for hit and false alarm rates (pp. 325, eq. 13.5)
  phi_hit <- 1/sqrt(2*pi)*exp(1)^(-0.5*qnorm(h)^2)
  phi_fa <- 1/sqrt(2*pi)*exp(1)^(-0.5*qnorm(fa)^2)
  # Find variance of d' (pp. 329, eq. 13.7)
  var_dPrime_2afc <- (h*(1-h))/(2*nPresent*(phi_hit^2)) + (fa*(1-fa)/(2*nAbsent*(phi_fa)^2))
  # Find confidence interval around d'
  se_dPrime_2afc <<- var_dPrime_2afc^0.5
  lower_CI_dPrime_2afc <<- dPrime_2afc - se_dPrime_2afc * qnorm(alpha/2, lower.tail=FALSE)
  upper_CI_dPrime_2afc <<- dPrime_2afc + se_dPrime_2afc * qnorm(alpha/2, lower.tail=FALSE)
  mylist <- list("SE_dPrime_2afc"=se_dPrime_2afc, "upper_CI_dPrime_2afc"=upper_CI_dPrime_2afc, "lower_CI_dPrime_2afc"=lower_CI_dPrime_2afc)
  return(mylist) 
}


# Estimate the variance and construct confidence intervals for a criterion estimate 
estimate_variance_criterion <- function(h, fa, nPresent, nAbsent, alpha) {
  # Calculate phi for hit and false alarm rates (pp. 325, eq. 13.5)
  phi_hit <- 1/sqrt(2*pi)*exp(1)^(-0.5*qnorm(h)^2)
  phi_fa <- 1/sqrt(2*pi)*exp(1)^(-0.5*qnorm(fa)^2)
  # Find variance of d' (pp. 325, eq. 13.4)
  var_dPrime <- (h*(1-h))/(nPresent*(phi_hit^2)) + (fa*(1-fa)/(nAbsent*(phi_fa)^2))
  var_criterion <- var_dPrime * 0.25
  # Find confidence interval around d'
  se_criterion <<- var_criterion^0.5
  lower_CI_criterion <<- (-(qnorm(h) + qnorm(fa))/2) - se_criterion * qnorm(alpha/2, lower.tail=FALSE)
  upper_CI_criterion <<- (-(qnorm(h) + qnorm(fa))/2) + se_criterion * qnorm(alpha/2, lower.tail=FALSE)
  mylist <- list("SE_criterion"=se_criterion, "upper_CI_criterion"=upper_CI_criterion, "lower_CI_criterion"=lower_CI_criterion)
  return(mylist) 
}


# Null hypothesis significance test
sig_test <- function(d, se, alpha) {
  z <- d / se
  p <- exp(-0.717*z - 0.416*z^2)
  if (p < alpha) {
    cat("Reject the null, p =", p, "\n")
  } else {
    cat("N.s., p =", p, "\n")
  }
}

# Apply Hautus (1995) log-linear correction correction of adding 0.5 to every cell
hautus <- function(hits, FAs, nPresent, nAbsent) {
  hits=hits+0.5
  FAs=FAs+0.5
  nPresent=nPresent+1
  nAbsent=nAbsent+1
  hit_rate <<- hits / nPresent
  fa_rate <<- FAs / nAbsent 
}

