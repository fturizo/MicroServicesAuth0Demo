package fish.payara.demos.conference.session.services;

import fish.payara.demos.conference.session.entities.Session;
import java.time.Duration;
import java.time.LocalDate;
import java.util.logging.Logger;
import javax.enterprise.context.ApplicationScoped;
import javax.enterprise.context.Initialized;
import javax.enterprise.event.Observes;
import javax.inject.Inject;

/**
 * @author Fabio Turizo
 */
@ApplicationScoped
public class SessionInitializer {

    private static final Logger LOG = Logger.getLogger(SessionInitializer.class.getName());
    
    @Inject
    SessionService sessionService;
    
    public void initialize(@Observes @Initialized(ApplicationScoped.class) Object event){
        LOG.info("Initializing sessions");
        if(sessionService.retrieveSessions().isEmpty()){
            sessionService.addNewSession(new Session("Fun with Kubernetes and Payara Micro", "Ocarina", LocalDate.now(), Duration.ofMinutes(40)));
            sessionService.addNewSession(new Session("Securing Microservices with Auth0 and MicroProfile", "Esperanza", LocalDate.now(), Duration.ofMinutes(40)));
        }
    }
}
