library("rjson")
json_data <- fromJSON(paste(readLines('book_1_gist.json'),collapse=""))
days<-names(json_data)
weight <- numeric(0)
for (ii in 1:length(days)) {
  weight[ii] <- json_data[[days[ii]]]$weight
}
days <- as.numeric(days)
data <- data.frame(days,weight) 
library(ggplot2)
data$daysrnd <- round(data$days/5)*5
data$weightrnd <- round(data$weight/5)*5
ggplot(data, aes (x=daysrnd,y=weightrnd)) + geom_point(shape=19,position=position_jitter(width=1,height=.5)) + geom_smooth(method=lm) + theme(axis.title.x = element_blank()) + ylab("Bridget's Weight in pounds")
ggsave('r_scatter.jpg')
# Subsampling to avoid overplotting and because weight should be measured per week. 
days_subsampled <- numeric(0)
for (ii in seq(1,360, by = 7)) { if (ii %in% days) { days_subsampled <- append(days_subsampled,ii)}}
weights_subsampled <- numeric(0)
for (ii in 1:length(days_subsampled)) { weights_subsampled[ii] <- json_data[[days_subsampled[ii]]]$weight}
data_sub <- data.frame(days_subsampled, weights_subsampled)
ggplot(data_sub, aes(x=days_subsampled, y=weights_subsampled), xlab="Days", ylab = "Weight in lb") + geom_point(shape=19, alpha = 0.4, position=position_jitter(width=15, height=.5),size=3,color="#56B4E9") + geom_smooth(method=loess,fill=NA,color="black") + theme_bw() + xlab("days") + ylab('weight') + ggtitle("Bridget Jones : A year of emotions, pounds") + ylim(110,140)
